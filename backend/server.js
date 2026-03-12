import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Parser from "rss-parser";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import YahooFinance from "yahoo-finance2";
import nsePkg from "stock-nse-india";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cron from "node-cron";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import User from "./models/User.js";
import { authRequired } from "./middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const yahooFinance = new YahooFinance();
const { NseIndia } = nsePkg;
const nse = new NseIndia();

app.use(
    cors({
        origin: "https://finedu.vercel.app"
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));

const parser = new Parser({
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    },
    xml2js: {
        strict: false
    }
});

const RSS_SOURCES = [
    {
        name: "ET Markets",
        url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
        proxy: true,
        fallbackUrls: ["https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms"]
    },
    { name: "Zerodha Pulse", url: "https://pulse.zerodha.com/feed.php", proxy: false },
    { name: "Investing.com Market News", url: "https://www.investing.com/rss/news_25.rss", proxy: false }
];

let NEWS_CACHE = [];
let LAST_FETCH_TIME = 0;
const CACHE_DURATION = 30 * 60 * 1000;
const NEWS_FALLBACK = [
    {
        title: "Markets update pending from live feeds",
        summary: "Live RSS feeds are temporarily unavailable. Please check back shortly for the latest finance headlines.",
        link: "https://economictimes.indiatimes.com/markets",
        source: "FinEdu",
        published: new Date().toUTCString()
    },
    {
        title: "NIFTY and Sensex watch",
        summary: "Track benchmark indices and sector rotation before making short-term allocation decisions.",
        link: "https://www.nseindia.com/",
        source: "FinEdu",
        published: new Date().toUTCString()
    },
    {
        title: "Risk management reminder",
        summary: "Use position sizing, stop-loss discipline, and diversification to manage drawdowns in volatile sessions.",
        link: "https://www.sebi.gov.in/",
        source: "FinEdu",
        published: new Date().toUTCString()
    }
];
let STOCKS_CACHE = [];
let STOCKS_CACHE_TIME = 0;
const STOCKS_CACHE_DURATION = 6 * 60 * 60 * 1000;
let SCREENER_DATA_CACHE = [];
let SCREENER_DATA_CACHE_TIME = 0;
let SCREENER_CACHE_REFRESHING = false;
const SCREENER_CACHE_DURATION = 6 * 60 * 60 * 1000;
const SCREENER_UNIVERSE = [
    "RELIANCE.NS",
    "TCS.NS",
    "INFY.NS",
    "HDFCBANK.NS",
    "ICICIBANK.NS",
    "SBIN.NS",
    "ITC.NS",
    "LT.NS",
    "KOTAKBANK.NS",
    "HINDUNILVR.NS",
    "BAJFINANCE.NS",
    "BHARTIARTL.NS",
    "AXISBANK.NS",
    "ASIANPAINT.NS",
    "MARUTI.NS",
    "TITAN.NS",
    "SUNPHARMA.NS",
    "ULTRACEMCO.NS",
    "POWERGRID.NS",
    "NESTLEIND.NS",
    "WIPRO.NS",
    "TECHM.NS",
    "NTPC.NS",
    "ONGC.NS",
    "ADANIENT.NS",
    "ADANIPORTS.NS",
    "GRASIM.NS",
    "JSWSTEEL.NS",
    "COALINDIA.NS",
    "INDUSINDBK.NS",
    "TATASTEEL.NS",
    "HCLTECH.NS",
    "EICHERMOT.NS",
    "BAJAJFINSV.NS",
    "DIVISLAB.NS",
    "DRREDDY.NS",
    "CIPLA.NS",
    "APOLLOHOSP.NS",
    "BPCL.NS",
    "HEROMOTOCO.NS",
    "BRITANNIA.NS",
    "SHREECEM.NS",
    "PIDILITIND.NS",
    "DABUR.NS",
    "M&M.NS",
    "SBILIFE.NS",
    "ICICIPRULI.NS",
    "TATAMOTORS.NS",
    "GODREJCP.NS",
    "TATACONSUM.NS",
    "HDFCLIFE.NS",
    "BAJAJ-AUTO.NS",
    "UPL.NS"
];
const PEER_UNIVERSE_BY_SECTOR = {
    "Technology": ["TCS.NS", "INFY.NS", "WIPRO.NS", "TECHM.NS", "HCLTECH.NS"],
    "Financial Services": ["HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "KOTAKBANK.NS", "AXISBANK.NS", "BAJFINANCE.NS"],
    "Energy": ["RELIANCE.NS", "ONGC.NS", "BPCL.NS", "NTPC.NS", "POWERGRID.NS", "COALINDIA.NS"],
    "Healthcare": ["SUNPHARMA.NS", "DRREDDY.NS", "CIPLA.NS", "DIVISLAB.NS", "APOLLOHOSP.NS"],
    "Consumer Defensive": ["HINDUNILVR.NS", "ITC.NS", "NESTLEIND.NS", "DABUR.NS", "GODREJCP.NS", "BRITANNIA.NS"],
    "Consumer Cyclical": ["MARUTI.NS", "TATAMOTORS.NS", "M&M.NS", "TITAN.NS", "BAJAJ-AUTO.NS", "HEROMOTOCO.NS"],
    "Industrials": ["LT.NS", "ADANIPORTS.NS", "EICHERMOT.NS", "SHREECEM.NS", "ULTRACEMCO.NS"],
    "Basic Materials": ["TATASTEEL.NS", "JSWSTEEL.NS", "GRASIM.NS", "PIDILITIND.NS", "UPL.NS"]
};

function readNumeric(value) {
    if (typeof value === "number") return value;
    if (typeof value === "object" && value !== null && typeof value.raw === "number") return value.raw;
    return null;
}

function normalizeRoe(value) {
    const roe = readNumeric(value);
    if (roe === null) return null;
    return roe <= 1 && roe >= -1 ? roe * 100 : roe;
}

function parseOptionalNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function normalizeYahooSymbol(input) {
    const cleaned = String(input || "")
        .toUpperCase()
        .replace(/^NSE:/, "")
        .replace(/\.NS$/, "")
        .replace(/[^A-Z0-9&-]/g, "")
        .trim();
    if (!cleaned) return null;
    return `${cleaned}.NS`;
}

function toDisplaySymbol(nsSymbol) {
    return String(nsSymbol || "").replace(".NS", "");
}

function buildNseYahooSymbol(rawSymbol) {
    const cleaned = String(rawSymbol || "")
        .toUpperCase()
        .replace(/\.NS$/, "")
        .replace(/[^A-Z0-9&-]/g, "")
        .trim();
    if (!cleaned) return null;
    return `${cleaned}.NS`;
}

const API_KEY = process.env.GEMINI_API_KEY;

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

const SEMINAR_REGISTRATIONS_PATH = path.resolve(__dirname, "./data/seminar-registrations.json");
const SEMINAR_CATALOG = {
    seminar_001: {
        id: "seminar_001",
        title: "FinEdu Live Seminar: Market Cycles and Risk Control",
        dateISO: "2026-03-20T13:30:00Z",
        durationMinutes: 90,
        joinLink: "https://zoom.us/j/1234567890",
        speaker: "Raghav Mehta, CFA",
        location: "Online Zoom Session",
        details: "Expert-led session on risk management, asset allocation, and practical decision frameworks."
    }
};

let seminarMailTransporter = null;
let seminarReminderJobStarted = false;

function ensureSeminarStorageFile() {
    const dir = path.dirname(SEMINAR_REGISTRATIONS_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(SEMINAR_REGISTRATIONS_PATH)) {
        fs.writeFileSync(SEMINAR_REGISTRATIONS_PATH, "[]", "utf-8");
    }
}

function readSeminarRegistrations() {
    try {
        ensureSeminarStorageFile();
        const raw = fs.readFileSync(SEMINAR_REGISTRATIONS_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Unable to read seminar registrations:", error.message);
        return [];
    }
}

function writeSeminarRegistrations(registrations) {
    ensureSeminarStorageFile();
    fs.writeFileSync(SEMINAR_REGISTRATIONS_PATH, JSON.stringify(registrations, null, 2), "utf-8");
}

function sanitizePhoneNumber(phone) {
    const value = String(phone || "").trim();
    if (!value) return "";
    const compact = value.replace(/\s+/g, "");
    return /^[+]?[0-9]{7,15}$/.test(compact) ? compact : null;
}

function getSeminarById(seminarId) {
    return SEMINAR_CATALOG[String(seminarId || "").trim()] || null;
}

function formatGoogleCalendarDate(date) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    const hh = String(date.getUTCHours()).padStart(2, "0");
    const mm = String(date.getUTCMinutes()).padStart(2, "0");
    const ss = String(date.getUTCSeconds()).padStart(2, "0");
    return `${y}${m}${d}T${hh}${mm}${ss}Z`;
}

function buildSeminarGoogleCalendarLink(seminar) {
    const start = new Date(seminar.dateISO);
    const end = new Date(start.getTime() + seminar.durationMinutes * 60 * 1000);
    const query = new URLSearchParams({
        action: "TEMPLATE",
        text: seminar.title,
        dates: `${formatGoogleCalendarDate(start)}/${formatGoogleCalendarDate(end)}`,
        details: seminar.details,
        location: seminar.location
    });
    return `https://calendar.google.com/calendar/render?${query.toString()}`;
}

function getSeminarTransporter() {
    if (seminarMailTransporter) return seminarMailTransporter;

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        return null;
    }

    seminarMailTransporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass }
    });

    return seminarMailTransporter;
}

async function sendSeminarConfirmationEmail(registration, seminar) {
    const transporter = getSeminarTransporter();
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
    if (!transporter || !from) {
        console.warn("Skipping confirmation email: SMTP configuration missing.");
        return false;
    }

    const start = new Date(seminar.dateISO);
    const when = `${start.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })} at ${start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}`;
    const calendarLink = buildSeminarGoogleCalendarLink(seminar);

    await transporter.sendMail({
        from,
        to: registration.email,
        subject: "Your seat is confirmed for the FinEdu Live Seminar",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
                <h2 style="margin-bottom: 8px;">Registration Confirmed</h2>
                <p>Hello ${registration.name}, your seat is confirmed.</p>
                <p><strong>Seminar:</strong> ${seminar.title}</p>
                <p><strong>Date and Time:</strong> ${when}</p>
                <p><strong>Join Link:</strong> <a href="${seminar.joinLink}">Join Session</a></p>
                <p><a href="${calendarLink}" style="display:inline-block; padding:10px 14px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px;">Add to Calendar</a></p>
                <p>See you live,<br/>Team FinEdu</p>
            </div>
        `
    });

    return true;
}

async function sendSeminarReminderEmail(registration, seminar) {
    const transporter = getSeminarTransporter();
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
    if (!transporter || !from) {
        console.warn("Skipping reminder email: SMTP configuration missing.");
        return false;
    }

    const start = new Date(seminar.dateISO);
    const when = `${start.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })} at ${start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}`;

    await transporter.sendMail({
        from,
        to: registration.email,
        subject: "Reminder: Your FinEdu Seminar starts today",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
                <h2 style="margin-bottom: 8px;">Seminar Reminder</h2>
                <p>Hello ${registration.name}, your FinEdu session is scheduled for today.</p>
                <p><strong>Session:</strong> ${seminar.title}</p>
                <p><strong>Time:</strong> ${when}</p>
                <p><strong>Speaker:</strong> ${seminar.speaker}</p>
                <p><strong>Join Link:</strong> <a href="${seminar.joinLink}">Join Session</a></p>
                <p>Best regards,<br/>Team FinEdu</p>
            </div>
        `
    });

    return true;
}

function isSameUtcDay(a, b) {
    return a.getUTCFullYear() === b.getUTCFullYear()
        && a.getUTCMonth() === b.getUTCMonth()
        && a.getUTCDate() === b.getUTCDate();
}

async function runSeminarReminderJob() {
    const registrations = readSeminarRegistrations();
    if (!registrations.length) return;

    const now = new Date();
    let hasUpdates = false;

    for (const registration of registrations) {
        if (registration.reminderSentAt) continue;

        const seminar = getSeminarById(registration.seminarId);
        if (!seminar) continue;

        const seminarDate = new Date(seminar.dateISO);
        if (!isSameUtcDay(seminarDate, now)) continue;

        try {
            const sent = await sendSeminarReminderEmail(registration, seminar);
            if (sent) {
                registration.reminderSentAt = new Date().toISOString();
                hasUpdates = true;
            }
        } catch (error) {
            console.error(`Reminder email failed for ${registration.email}:`, error.message);
        }
    }

    if (hasUpdates) {
        writeSeminarRegistrations(registrations);
    }
}

function startSeminarReminderScheduler() {
    if (seminarReminderJobStarted) return;
    seminarReminderJobStarted = true;

    cron.schedule("0 * * * *", () => {
        runSeminarReminderJob().catch((error) => {
            console.error("Seminar reminder job error:", error.message);
        });
    });

    console.log("Seminar reminder scheduler started (hourly).");
}

function validatePassword(password) {
    const value = String(password || "");
    if (value.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    return null;
}

function signAuthToken(user) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured.");
    }

    return jwt.sign(
        { email: user.email },
        jwtSecret,
        {
            subject: String(user._id),
            expiresIn: JWT_EXPIRES_IN
        }
    );
}

function getAuthReadiness() {
    const mongoUri = process.env.MONGODB_URI;
    const jwtSecret = process.env.JWT_SECRET;
    const mongoConnected = Boolean(mongoose.connection?.readyState === 1);

    if (!mongoUri) {
        return {
            ready: false,
            code: "MONGODB_URI_MISSING",
            message: "Authentication service unavailable: MONGODB_URI is not configured.",
            details: {
                mongoConfigured: false,
                mongoConnected,
                jwtConfigured: Boolean(jwtSecret)
            }
        };
    }

    if (!mongoConnected) {
        return {
            ready: false,
            code: "MONGODB_DISCONNECTED",
            message: "Authentication service unavailable: database connection is not ready.",
            details: {
                mongoConfigured: true,
                mongoConnected: false,
                jwtConfigured: Boolean(jwtSecret)
            }
        };
    }

    if (!jwtSecret) {
        return {
            ready: false,
            code: "JWT_SECRET_MISSING",
            message: "Authentication service unavailable: JWT_SECRET is not configured.",
            details: {
                mongoConfigured: true,
                mongoConnected: true,
                jwtConfigured: false
            }
        };
    }

    return {
        ready: true,
        code: "AUTH_READY",
        message: "Authentication service ready.",
        details: {
            mongoConfigured: true,
            mongoConnected: true,
            jwtConfigured: true
        }
    };
}

function ensureAuthReady(res) {
    const readiness = getAuthReadiness();
    if (readiness.ready) return true;
    return res.status(503).json({
        error: readiness.message,
        code: readiness.code,
        details: readiness.details
    });
}

async function connectMongo() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.warn("MONGODB_URI not set. Authentication endpoints will be unavailable.");
        return;
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected.");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
    }
}

const promptTemplatePath = path.resolve(__dirname, "./assistant-prompt-template.txt");
const ASSISTANT_SYSTEM_PROMPT = fs.existsSync(promptTemplatePath)
    ? fs.readFileSync(promptTemplatePath, "utf-8")
    : "You are FinEdu AI. Provide concise, practical Indian finance guidance.";

const model = API_KEY
    ? new GoogleGenerativeAI(API_KEY).getGenerativeModel({ model: "gemini-2.5-flash" })
    : null;
const FMP_API_KEY = process.env.FMP_API_KEY || "demo";
const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";

function normalizeNewsItem(item, sourceName) {
    const title = String(item?.title || "Untitled").trim();
    const link = String(item?.link || "#").trim();
    const summary = String(item?.contentSnippet || item?.content || item?.summary || "").trim();
    const rawDate = item?.isoDate || item?.pubDate || item?.published || "";
    const parsedTs = Date.parse(String(rawDate || ""));
    const normalizedDate = Number.isFinite(parsedTs) ? new Date(parsedTs).toISOString() : "";

    // Keep both date and published for backward compatibility with existing frontend code.
    return {
        title,
        link,
        summary,
        source: sourceName,
        date: normalizedDate,
        published: normalizedDate || String(rawDate || "")
    };
}

function normalizeRss2JsonItem(item, sourceName) {
    return normalizeNewsItem(
        {
            title: item?.title,
            link: item?.link,
            contentSnippet: item?.description,
            content: item?.content,
            pubDate: item?.pubDate
        },
        sourceName
    );
}

async function fetchRssItems(source) {
    const sourceUrls = [source.url, ...(Array.isArray(source.fallbackUrls) ? source.fallbackUrls : [])];
    const candidateUrls = sourceUrls.flatMap((url) => {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        return source.proxy ? [proxyUrl, url] : [url, proxyUrl];
    });

    const parseByUrl = async (url) => {
        const feed = await parser.parseURL(url);
        return (feed.items || [])
            .slice(0, 8)
            .map((item) => normalizeNewsItem(item, source.name));
    };

    const parseByXmlString = async (url) => {
        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9"
            }
        });

        const rawXml = String(response?.data || "");
        const xml = rawXml
            .replace(/^[\u0000-\u001F\u007F]+/g, "")
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
        if (!xml.trim()) {
            throw new Error("Empty RSS response");
        }

        const feed = await parser.parseString(xml);
        return (feed.items || [])
            .slice(0, 8)
            .map((item) => normalizeNewsItem(item, source.name));
    };

    const parseByRss2Json = async (url) => {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, {
            timeout: 15000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            }
        });

        const items = Array.isArray(response?.data?.items) ? response.data.items : [];
        return items
            .slice(0, 8)
            .map((item) => normalizeRss2JsonItem(item, source.name));
    };

    let lastError = null;
    for (const url of candidateUrls) {
        try {
            let items = [];

            try {
                items = await parseByUrl(url);
            } catch (urlError) {
                items = await parseByXmlString(url);
            }

            if (items.length) {
                return items;
            }
        } catch (error) {
            lastError = error;
        }
    }

    for (const url of sourceUrls) {
        try {
            const items = await parseByRss2Json(url);
            if (items.length) {
                return items;
            }
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error("RSS fetch failed");
}

async function fetchNews() {
    const allNews = [];
    for (const source of RSS_SOURCES) {
        try {
            const items = await fetchRssItems(source);
            allNews.push(...items);
        } catch (error) {
            console.error(`Skipping ${source.name}: ${error.message}`);
        }
    }

    const uniqueNews = [];
    const seenKeys = new Set();
    for (const item of allNews) {
        const key = `${String(item.link || "").trim()}|${String(item.title || "").trim().toLowerCase()}`;
        if (!key || seenKeys.has(key)) continue;
        seenKeys.add(key);
        uniqueNews.push(item);
    }

    const sortedNews = uniqueNews.sort((a, b) => {
        const ta = Date.parse(String(a?.date || a?.published || ""));
        const tb = Date.parse(String(b?.date || b?.published || ""));
        return (Number.isFinite(tb) ? tb : 0) - (Number.isFinite(ta) ? ta : 0);
    });

    if (sortedNews.length) {
        NEWS_CACHE = sortedNews;
        LAST_FETCH_TIME = Date.now();
        return NEWS_CACHE;
    }

    if (!NEWS_CACHE.length) {
        NEWS_CACHE = NEWS_FALLBACK;
        LAST_FETCH_TIME = Date.now();
    }

    return NEWS_CACHE;
}

async function fetchNseStocks() {
    const now = Date.now();
    if (STOCKS_CACHE.length && (now - STOCKS_CACHE_TIME) < STOCKS_CACHE_DURATION) {
        return STOCKS_CACHE;
    }

    const response = await nse.getEquityStockIndices("NIFTY 500");
    const rows = Array.isArray(response?.data) ? response.data : [];
    const seen = new Set();

    const stocks = rows
        .filter((item) => item?.symbol && !String(item.symbol).includes(" "))
        .map((item) => ({
            symbol: String(item.symbol).trim(),
            name: String(item?.meta?.companyName || item.symbol).trim()
        }))
        .filter((item) => {
            if (!item.symbol || seen.has(item.symbol)) return false;
            seen.add(item.symbol);
            return true;
        })
        .sort((a, b) => a.symbol.localeCompare(b.symbol));

    STOCKS_CACHE = stocks;
    STOCKS_CACHE_TIME = now;
    return stocks;
}

async function fetchScreenerDataForSymbol(symbol) {
    try {
        const quote = await yahooFinance.quote(symbol);

        let roe = null;
        let stockSector = "Unknown";
        let debtEquity = null;
        let revenueGrowth = null;
        let profitGrowth = null;

        try {
            const details = await yahooFinance.quoteSummary(symbol, {
                modules: ["financialData", "assetProfile"]
            });
            roe = normalizeRoe(details?.financialData?.returnOnEquity);
            stockSector = String(details?.assetProfile?.sector || "Unknown");
            debtEquity = readNumeric(details?.financialData?.debtToEquity);
            revenueGrowth = readNumeric(details?.financialData?.revenueGrowth);
            profitGrowth = readNumeric(details?.financialData?.earningsGrowth);
        } catch (profileError) {
            // Keep quote-level fields even if profile modules fail.
        }

        return {
            symbol: String(quote?.symbol || symbol).replace(".NS", ""),
            name: quote?.shortName || quote?.longName || symbol.replace(".NS", ""),
            price: readNumeric(quote?.regularMarketPrice),
            marketCap: readNumeric(quote?.marketCap),
            peRatio: readNumeric(quote?.trailingPE),
            roe,
            debtEquity,
            revenueGrowth,
            profitGrowth,
            sector: stockSector
        };
    } catch (error) {
        return null;
    }
}

async function refreshScreenerDataCache(force = false) {
    if (SCREENER_CACHE_REFRESHING) return;

    const now = Date.now();
    if (!force && SCREENER_DATA_CACHE.length && (now - SCREENER_DATA_CACHE_TIME) < SCREENER_CACHE_DURATION) {
        return;
    }

    SCREENER_CACHE_REFRESHING = true;
    try {
        const rawSymbols = await nse.getAllStockSymbols();
        const yahooSymbols = (Array.isArray(rawSymbols) ? rawSymbols : [])
            .map(buildNseYahooSymbol)
            .filter(Boolean);

        const uniqueSymbols = [...new Set(yahooSymbols)];
        const chunkSize = 60;
        const records = [];

        for (let i = 0; i < uniqueSymbols.length; i += chunkSize) {
            const chunk = uniqueSymbols.slice(i, i + chunkSize);
            const batch = await Promise.all(chunk.map((symbol) => fetchScreenerDataForSymbol(symbol)));
            records.push(...batch.filter(Boolean));
        }

        SCREENER_DATA_CACHE = records;
        SCREENER_DATA_CACHE_TIME = Date.now();
        console.log(`Screener cache refreshed: ${records.length} NSE stocks loaded.`);
    } catch (error) {
        console.error("Screener cache refresh error:", error.message);
    } finally {
        SCREENER_CACHE_REFRESHING = false;
    }
}

app.get("/api/news", async (req, res) => {
    try {
        const isStale = !LAST_FETCH_TIME || (Date.now() - LAST_FETCH_TIME) >= CACHE_DURATION;
        if (!NEWS_CACHE.length || isStale) {
            await fetchNews();
        }

        if (!NEWS_CACHE.length) {
            return res.status(503).json({ error: "News is loading, please try again shortly." });
        }

        return res.json({ lastUpdated: LAST_FETCH_TIME, data: NEWS_CACHE });
    } catch (error) {
        console.error("News endpoint error:", error.message);
        if (NEWS_CACHE.length) {
            return res.json({ lastUpdated: LAST_FETCH_TIME, data: NEWS_CACHE });
        }
        return res.status(503).json({ error: "News is loading, please try again shortly." });
    }
});

app.get("/api/stocks", async (req, res) => {
    try {
        const stocks = await fetchNseStocks();
        return res.json(stocks);
    } catch (error) {
        console.error("Stocks list error:", error.message);
        return res.status(500).json({ error: "Unable to fetch stock list." });
    }
});

app.post("/api/seminar/register", async (req, res) => {
    try {
        const name = String(req.body?.name || "").trim();
        const email = String(req.body?.email || "").trim().toLowerCase();
        const experience = String(req.body?.experience || "").trim();
        const seminarId = String(req.body?.seminarId || "").trim();
        const normalizedPhone = sanitizePhoneNumber(req.body?.phone || "");

        if (!name || !email || !experience || !seminarId) {
            return res.status(400).json({ error: "name, email, experience and seminarId are required." });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Please provide a valid email address." });
        }

        if (!["Beginner", "Intermediate", "Advanced"].includes(experience)) {
            return res.status(400).json({ error: "experience must be Beginner, Intermediate, or Advanced." });
        }

        if (normalizedPhone === null) {
            return res.status(400).json({ error: "Please provide a valid phone number." });
        }

        const seminar = getSeminarById(seminarId);
        if (!seminar) {
            return res.status(400).json({ error: "Invalid seminarId." });
        }

        const registrations = readSeminarRegistrations();
        const existing = registrations.find((entry) => entry.seminarId === seminarId && entry.email === email);

        if (!existing) {
            registrations.push({
                id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                seminarId,
                name,
                email,
                phone: normalizedPhone || "",
                experience,
                createdAt: new Date().toISOString(),
                reminderSentAt: null
            });
            writeSeminarRegistrations(registrations);
        }

        try {
            await sendSeminarConfirmationEmail(existing || { name, email }, seminar);
        } catch (emailError) {
            console.error("Confirmation email failed:", emailError.message);
        }

        return res.json({
            success: true,
            message: "Registration successful"
        });
    } catch (error) {
        console.error("Seminar registration error:", error.message);
        return res.status(500).json({ error: "Unable to register right now." });
    }
});

app.get("/api/screener", async (req, res) => {
    const marketCapMin = parseOptionalNumber(req.query.marketCap ?? req.query.marketCapMin);
    const peMax = parseOptionalNumber(req.query.pe ?? req.query.peMax);
    const roeMin = parseOptionalNumber(req.query.roe ?? req.query.roeMin);
    const debtEquityMax = parseOptionalNumber(req.query.debtEquityMax);
    const revenueGrowthMin = parseOptionalNumber(req.query.revenueGrowthMin);
    const profitGrowthMin = parseOptionalNumber(req.query.profitGrowthMin);
    const priceMin = parseOptionalNumber(req.query.priceMin);
    const priceMax = parseOptionalNumber(req.query.priceMax);
    const sector = String(req.query.sector || "").trim().toLowerCase();
    console.log("Screener request received:", req.query);

    try {
        if (!SCREENER_DATA_CACHE.length) {
            await refreshScreenerDataCache(true);
        } else if ((Date.now() - SCREENER_DATA_CACHE_TIME) >= SCREENER_CACHE_DURATION) {
            refreshScreenerDataCache(false);
        }

        const filtered = SCREENER_DATA_CACHE
            .filter((stock) => {
                if (marketCapMin === null || stock.marketCap === null) return true;
                return stock.marketCap >= marketCapMin;
            })
            .filter((stock) => {
                if (peMax === null || stock.peRatio === null) return true;
                return stock.peRatio <= peMax;
            })
            .filter((stock) => {
                if (roeMin === null || stock.roe === null) return true;
                return stock.roe >= roeMin;
            })
            .filter((stock) => {
                if (debtEquityMax === null || stock.debtEquity === null) return true;
                return stock.debtEquity <= debtEquityMax;
            })
            .filter((stock) => {
                if (revenueGrowthMin === null || stock.revenueGrowth === null) return true;
                return stock.revenueGrowth >= revenueGrowthMin / 100;
            })
            .filter((stock) => {
                if (profitGrowthMin === null || stock.profitGrowth === null) return true;
                return stock.profitGrowth >= profitGrowthMin / 100;
            })
            .filter((stock) => {
                if (priceMin === null || stock.price === null) return true;
                return stock.price >= priceMin;
            })
            .filter((stock) => {
                if (priceMax === null || stock.price === null) return true;
                return stock.price <= priceMax;
            })
            .filter((stock) => (!sector ? true : String(stock.sector || "").toLowerCase() === sector))
            .slice(0, 20);

        return res.json(filtered);
    } catch (error) {
        console.error("Screener error:", error.message);
        return res.status(500).json({ error: "Unable to fetch screener data right now." });
    }
});

app.get("/api/stock/:symbol", async (req, res) => {
    const yahooSymbol = normalizeYahooSymbol(req.params.symbol);
    if (!yahooSymbol) {
        return res.status(400).json({ error: "Stock data unavailable" });
    }

    try {
        const quote = await yahooFinance.quoteSummary(yahooSymbol, {
            modules: ["price", "summaryDetail", "defaultKeyStatistics", "financialData", "assetProfile"]
        });

        const symbol = yahooSymbol.replace(".NS", "");
        const name = quote?.price?.longName || quote?.price?.shortName || symbol;
        const price = readNumeric(quote?.price?.regularMarketPrice);
        const changePercent = readNumeric(quote?.price?.regularMarketChangePercent);
        const marketCap = readNumeric(quote?.price?.marketCap ?? quote?.summaryDetail?.marketCap);
        const peRatio = readNumeric(quote?.summaryDetail?.trailingPE);
        const eps = readNumeric(
            quote?.defaultKeyStatistics?.trailingEps ?? quote?.defaultKeyStatistics?.forwardEps
        );
        const roe = normalizeRoe(quote?.financialData?.returnOnEquity);
        const high52 = readNumeric(quote?.summaryDetail?.fiftyTwoWeekHigh);
        const low52 = readNumeric(quote?.summaryDetail?.fiftyTwoWeekLow);
        const sector = String(quote?.assetProfile?.sector || "Unknown");
        const industry = String(quote?.assetProfile?.industry || "Unknown");
        const description = String(quote?.assetProfile?.longBusinessSummary || "");

        if (price === null && marketCap === null && peRatio === null) {
            return res.status(404).json({ error: "Stock data unavailable" });
        }

        return res.json({
            symbol,
            name,
            price,
            changePercent,
            marketCap,
            peRatio,
            eps,
            roe,
            high52,
            low52,
            sector,
            industry,
            description
        });
    } catch (error) {
        console.error("Stock detail error:", error.message);
        return res.status(404).json({ error: "Stock data unavailable" });
    }
});

app.get("/api/stock/:symbol/financials", async (req, res) => {
    const yahooSymbol = normalizeYahooSymbol(req.params.symbol);
    if (!yahooSymbol) {
        return res.status(400).json({ error: "Financial data unavailable" });
    }

    const fmpSymbol = yahooSymbol;
    const buildUrl = (path) => `${FMP_BASE_URL}/${path}/${encodeURIComponent(fmpSymbol)}?period=annual&limit=5&apikey=${encodeURIComponent(FMP_API_KEY)}`;

    try {
        const [incomeRes, balanceRes, cashRes, ratiosRes] = await Promise.all([
            axios.get(buildUrl("income-statement")),
            axios.get(buildUrl("balance-sheet-statement")),
            axios.get(buildUrl("cash-flow-statement")),
            axios.get(buildUrl("ratios"))
        ]);

        return res.json({
            symbol: String(req.params.symbol || "").toUpperCase(),
            incomeStatement: Array.isArray(incomeRes.data) ? incomeRes.data : [],
            balanceSheet: Array.isArray(balanceRes.data) ? balanceRes.data : [],
            cashFlow: Array.isArray(cashRes.data) ? cashRes.data : [],
            ratios: Array.isArray(ratiosRes.data) ? ratiosRes.data : []
        });
    } catch (error) {
        console.error("Financial data error:", error.message);
        return res.status(500).json({ error: "Financial data unavailable" });
    }
});

app.get("/api/stock/:symbol/peers", async (req, res) => {
    const yahooSymbol = normalizeYahooSymbol(req.params.symbol);
    if (!yahooSymbol) {
        return res.status(400).json({ error: "Peer data unavailable" });
    }

    try {
        const targetSummary = await yahooFinance.quoteSummary(yahooSymbol, {
            modules: ["assetProfile"]
        });
        const targetSector = String(targetSummary?.assetProfile?.sector || "").trim();

        const sectorUniverse = targetSector && PEER_UNIVERSE_BY_SECTOR[targetSector]
            ? PEER_UNIVERSE_BY_SECTOR[targetSector]
            : SCREENER_UNIVERSE;

        const uniqueSymbols = [...new Set([yahooSymbol, ...sectorUniverse])]
            .filter((s) => s && s.endsWith(".NS"))
            .slice(0, 12);

        const peers = await Promise.all(
            uniqueSymbols.map(async (symbol) => {
                try {
                    const [quote, details] = await Promise.all([
                        yahooFinance.quote(symbol),
                        yahooFinance.quoteSummary(symbol, {
                            modules: ["financialData", "summaryDetail", "assetProfile"]
                        })
                    ]);

                    return {
                        symbol: toDisplaySymbol(symbol),
                        company: quote?.shortName || quote?.longName || toDisplaySymbol(symbol),
                        price: readNumeric(quote?.regularMarketPrice),
                        pe: readNumeric(quote?.trailingPE ?? details?.summaryDetail?.trailingPE),
                        marketCap: readNumeric(quote?.marketCap ?? details?.summaryDetail?.marketCap),
                        roe: normalizeRoe(details?.financialData?.returnOnEquity),
                        revenueGrowth: readNumeric(details?.financialData?.revenueGrowth),
                        sector: String(details?.assetProfile?.sector || targetSector || "Unknown"),
                        isSelected: symbol === yahooSymbol
                    };
                } catch (error) {
                    return null;
                }
            })
        );

        const result = peers
            .filter(Boolean)
            .filter((row) => row.isSelected || !targetSector || row.sector === targetSector)
            .slice(0, 10);

        return res.json({
            symbol: toDisplaySymbol(yahooSymbol),
            sector: targetSector || "Unknown",
            data: result
        });
    } catch (error) {
        console.error("Peer data error:", error.message);
        return res.status(500).json({ error: "Peer data unavailable" });
    }
});

app.post("/api/auth/signup", async (req, res) => {
    try {
        if (!ensureAuthReady(res)) return;

        const name = String(req.body?.name || "").trim();
        const email = String(req.body?.email || "").trim().toLowerCase();
        const password = String(req.body?.password || "");

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Please provide a valid email address." });
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({ error: passwordError });
        }

        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(409).json({ error: "An account with this email already exists." });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, passwordHash });
        const token = signAuthToken(user);

        return res.status(201).json({
            message: "Account created successfully.",
            token,
            user: {
                id: String(user._id),
                name: user.name || "",
                email: user.email
            }
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        return res.status(500).json({ error: "Unable to create account right now." });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        if (!ensureAuthReady(res)) return;

        const email = String(req.body?.email || "").trim().toLowerCase();
        const password = String(req.body?.password || "");

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Please provide a valid email address." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const token = signAuthToken(user);

        return res.json({
            message: "Login successful.",
            token,
            user: {
                id: String(user._id),
                name: user.name || "",
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ error: "Unable to login right now." });
    }
});

app.get("/api/auth/me", authRequired, async (req, res) => {
    try {
        if (!ensureAuthReady(res)) return;

        const user = await User.findById(req.auth.userId).lean();
        if (!user) {
            return res.status(401).json({ error: "Unauthorized: user not found." });
        }

        return res.json({
            user: {
                id: String(user._id),
                name: user.name || "",
                email: user.email
            }
        });
    } catch (error) {
        console.error("Auth me error:", error.message);
        return res.status(500).json({ error: "Unable to fetch current user." });
    }
});

app.post("/api/auth/logout", (req, res) => {
    return res.json({ message: "Logout successful." });
});

app.post("/api/assistant", async (req, res) => {
    const message = String(req.body?.message || "").trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    const summary = String(req.body?.summary || "").trim();

    if (!message) {
        return res.status(400).json({ error: "Message is required." });
    }
    if (!model) {
        return res.status(503).json({ error: "AI service unavailable." });
    }

    try {
        const compactHistory = history
            .slice(-10)
            .filter((h) => h && (h.role === "user" || h.role === "ai") && typeof h.text === "string")
            .map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.text}`)
            .join("\n");

        const prompt = `
${ASSISTANT_SYSTEM_PROMPT}

Response style rules (must follow):
- Keep answer compact and direct.
- Prefer 3-6 short bullet points or 1-2 short paragraphs.
- Keep most answers under 120 words unless user asks for detail.
- Focus on practical, actionable guidance for Indian investors.
- Avoid long introductions, repetition, tables, and generic disclaimers.
- Sound natural and conversational, not textbook-like.
- Use a table only if the user explicitly asks for one.

Session summary:
${summary || "No prior summary."}

Recent conversation:
${compactHistory || "No recent context."}

Latest user query:
${message}
`;

        const result = await model.generateContent(prompt);
        const reply = result?.response?.text?.() || "I could not generate a response right now.";
        return res.json({ reply });
    } catch (error) {
        console.error("Assistant error:", error.message);
        return res.status(500).json({ error: "AI service unavailable." });
    }
});

fetchNews();
setInterval(fetchNews, CACHE_DURATION);

// ===================== MARKET DATA APIs (Yahoo Finance) =====================

// Get Major Indices
app.get("/api/indices", async (req, res) => {
    try {
        const indices = [
            { symbol: "NIFTY 50", yahoo: "^NSEI", name: "NIFTY 50" },
            { symbol: "SENSEX", yahoo: "^BSESN", name: "SENSEX" },
            { symbol: "BANKNIFTY", yahoo: "^NSEBANK", name: "NIFTY BANK" },
            { symbol: "NIFTY FIN", yahoo: "NSEFINNIFTY.NS", name: "NIFTY FIN" }
        ];
        
        const results = await Promise.all(
            indices.map(async (idx) => {
                try {
                    const quote = await yahooFinance.quote(idx.yahoo);
                    return {
                        symbol: idx.symbol,
                        name: idx.name,
                        value: readNumeric(quote.regularMarketPrice),
                        change: readNumeric(quote.regularMarketChange),
                        changePercent: readNumeric(quote.regularMarketChangePercent)
                    };
                } catch (e) { return null; }
            })
        );
        
        const valid = results.filter(r => r && r.value);
        if (valid.length) return res.json(valid);
        throw new Error("No data");
    } catch (error) {
        console.error("Indices error:", error.message);
        return res.json([
            { symbol: "NIFTY 50", name: "NIFTY 50", value: 22850.00, change: 85.25, changePercent: 0.37 },
            { symbol: "SENSEX", name: "SENSEX", value: 75600.00, change: 156.80, changePercent: 0.21 },
            { symbol: "BANKNIFTY", name: "NIFTY BANK", value: 48500.00, change: 245.60, changePercent: 0.51 },
            { symbol: "FINNIFTY", name: "NIFTY FIN", value: 19800.00, change: 42.30, changePercent: 0.21 }
        ]);
    }
});

// Get Top Gainers
app.get("/api/market/gainers", async (req, res) => {
    try {
        const symbols = SCREENER_UNIVERSE.slice(0, 25);
        const quotes = await Promise.all(symbols.map(s => yahooFinance.quote(s).catch(() => null)));
        
        const stocks = quotes
            .filter(q => q && q.regularMarketChangePercent > 0)
            .map(q => ({
                symbol: toDisplaySymbol(q.symbol),
                name: q.shortName || q.longName || toDisplaySymbol(q.symbol),
                price: readNumeric(q.regularMarketPrice),
                change: readNumeric(q.regularMarketChange),
                changePercent: readNumeric(q.regularMarketChangePercent),
                volume: q.regularMarketVolume
            }))
            .sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0))
            .slice(0, 15);
        
        return res.json(stocks);
    } catch (error) {
        console.error("Gainers error:", error.message);
        return res.json([]);
    }
});

// Get Top Losers
app.get("/api/market/losers", async (req, res) => {
    try {
        const symbols = SCREENER_UNIVERSE.slice(0, 25);
        const quotes = await Promise.all(symbols.map(s => yahooFinance.quote(s).catch(() => null)));
        
        const stocks = quotes
            .filter(q => q && q.regularMarketChangePercent < 0)
            .map(q => ({
                symbol: toDisplaySymbol(q.symbol),
                name: q.shortName || q.longName || toDisplaySymbol(q.symbol),
                price: readNumeric(q.regularMarketPrice),
                change: readNumeric(q.regularMarketChange),
                changePercent: readNumeric(q.regularMarketChangePercent),
                volume: q.regularMarketVolume
            }))
            .sort((a, b) => (a.changePercent || 0) - (b.changePercent || 0))
            .slice(0, 15);
        
        return res.json(stocks);
    } catch (error) {
        console.error("Losers error:", error.message);
        return res.json([]);
    }
});

// Get Most Active
app.get("/api/market/most-active", async (req, res) => {
    try {
        const symbols = SCREENER_UNIVERSE.slice(0, 30);
        const quotes = await Promise.all(symbols.map(s => yahooFinance.quote(s).catch(() => null)));
        
        const stocks = quotes
            .filter(q => q && q.regularMarketVolume)
            .map(q => ({
                symbol: toDisplaySymbol(q.symbol),
                name: q.shortName || q.longName || toDisplaySymbol(q.symbol),
                price: readNumeric(q.regularMarketPrice),
                change: readNumeric(q.regularMarketChange),
                changePercent: readNumeric(q.regularMarketChangePercent),
                volume: q.regularMarketVolume
            }))
            .sort((a, b) => (b.volume || 0) - (a.volume || 0))
            .slice(0, 15);
        
        return res.json(stocks);
    } catch (error) {
        console.error("Most active error:", error.message);
        return res.json([]);
    }
});

// Get Most Volatile
app.get("/api/market/most-volatile", async (req, res) => {
    try {
        const symbols = SCREENER_UNIVERSE.slice(0, 25);
        const quotes = await Promise.all(symbols.map(s => yahooFinance.quote(s).catch(() => null)));
        
        const stocks = quotes
            .filter(q => q && q.regularMarketChangePercent)
            .map(q => ({
                symbol: toDisplaySymbol(q.symbol),
                name: q.shortName || q.longName || toDisplaySymbol(q.symbol),
                price: readNumeric(q.regularMarketPrice),
                change: readNumeric(q.regularMarketChange),
                changePercent: readNumeric(q.regularMarketChangePercent),
                volume: q.regularMarketVolume
            }))
            .sort((a, b) => Math.abs(b.changePercent || 0) - Math.abs(a.changePercent || 0))
            .slice(0, 15);
        
        return res.json(stocks);
    } catch (error) {
        console.error("Most volatile error:", error.message);
        return res.json([]);
    }
});

// Get Trending
app.get("/api/market/trending", async (req, res) => {
    try {
        const symbols = SCREENER_UNIVERSE.slice(0, 15);
        const quotes = await Promise.all(symbols.map(s => yahooFinance.quote(s).catch(() => null)));
        
        const stocks = quotes
            .filter(q => q)
            .map(q => ({
                symbol: toDisplaySymbol(q.symbol),
                name: q.shortName || q.longName || toDisplaySymbol(q.symbol),
                price: readNumeric(q.regularMarketPrice),
                change: readNumeric(q.regularMarketChange),
                changePercent: readNumeric(q.regularMarketChangePercent)
            }))
            .slice(0, 10);
        
        return res.json(stocks);
    } catch (error) {
        console.error("Trending error:", error.message);
        return res.json([
            { symbol: "RELIANCE", name: "Reliance Industries", price: 2850.00, change: 12.50, changePercent: 0.44 },
            { symbol: "TCS", name: "Tata Consultancy Services", price: 4250.00, change: -8.25, changePercent: -0.19 },
            { symbol: "INFY", name: "Infosys Ltd", price: 1850.00, change: 22.30, changePercent: 1.22 },
            { symbol: "HDFCBANK", name: "HDFC Bank Ltd", price: 1680.00, change: -5.40, changePercent: -0.32 },
            { symbol: "ICICIBANK", name: "ICICI Bank Ltd", price: 1120.00, change: 8.60, changePercent: 0.77 },
            { symbol: "SBIN", name: "State Bank of India", price: 780.00, change: 15.20, changePercent: 1.99 }
        ]);
    }
});

// ETF Symbols List
const ETF_SYMBOLS = [
    "NIFTYBEES.NS",
    "BANKBEES.NS",
    "GOLDBEES.NS",
    "SILVERBEES.NS",
    "ITBEES.NS",
    "CPSEETF.NS"
];

// ETF Names and Categories mapping
const ETF_NAMES = {
    "NIFTYBEES.NS": { name: "Nifty Bees", category: "Equity" },
    "BANKBEES.NS": { name: "Bank Bees", category: "Equity" },
    "GOLDBEES.NS": { name: "Gold Bees", category: "Gold" },
    "SILVERBEES.NS": { name: "Silver Bees", category: "Gold" },
    "ITBEES.NS": { name: "IT Bees", category: "Sector" },
    "CPSEETF.NS": { name: "CPSE ETF", category: "Sector" }
};

// ETF Data Cache
let ETF_CACHE = [];
let ETF_CACHE_TIME = 0;
const ETF_CACHE_DURATION = 60 * 1000; // 60 seconds

// Get ETF Data
app.get("/api/etfs", async (req, res) => {
    try {
        // Check cache first
        const now = Date.now();
        if (ETF_CACHE.length && (now - ETF_CACHE_TIME) < ETF_CACHE_DURATION) {
            return res.json(ETF_CACHE);
        }

        const etfData = await Promise.all(
            ETF_SYMBOLS.map(async (symbol) => {
                try {
                    // Use the chart endpoint for historical data
                    const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
                    const response = await axios.get(chartUrl, {
                        timeout: 10000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    const data = response.data;
                    const result = data?.chart?.result?.[0];
                    
                    if (!result) return null;
                    
                    const meta = result.meta || {};
                    const quote = result.indicators?.quote?.[0] || {};
                    const currentPrice = meta.regularMarketPrice || meta.previousClose || null;
                    const previousClose = meta.chartPreviousClose || meta.previousClose || null;
                    
                    // Calculate price change and percentage
                    let priceChange = null;
                    let percentageChange = null;
                    
                    if (currentPrice !== null && previousClose !== null) {
                        priceChange = currentPrice - previousClose;
                        percentageChange = (priceChange / previousClose) * 100;
                    }
                    
                    // Get volume
                    const volume = meta.regularMarketVolume || quote.volume?.[quote.volume.length - 1] || null;
                    
                    // Get historical data for chart (last 30 days)
                    const timestamps = result.timestamp || [];
                    const closes = quote.close || [];
                    const volumes = quote.volume || [];
                    
                    const chartData = timestamps.map((ts, i) => ({
                        timestamp: ts * 1000,
                        date: new Date(ts * 1000).toISOString().split('T')[0],
                        close: closes[i] || null,
                        volume: volumes[i] || null
                    })).filter(d => d.close !== null);
                    
                    const etfInfo = ETF_NAMES[symbol] || { name: symbol, category: "Unknown" };
                    
                    return {
                        symbol: toDisplaySymbol(symbol),
                        name: etfInfo.name,
                        category: etfInfo.category,
                        price: currentPrice,
                        previousClose: previousClose,
                        priceChange: priceChange,
                        percentageChange: percentageChange,
                        volume: volume,
                        chartData: chartData
                    };
                } catch (error) {
                    console.error(`ETF fetch error for ${symbol}:`, error.message);
                    return null;
                }
            })
        );
        
        const validData = etfData.filter(Boolean);
        
        if (validData.length === 0) {
            // Return cached data or fallback if no new data
            if (ETF_CACHE.length) {
                return res.json(ETF_CACHE);
            }
            // Return fallback data if API fails
            return res.json([
                { symbol: "NIFTYBEES", name: "Nifty Bees", category: "Equity", price: 235.40, previousClose: 233.50, priceChange: 1.90, percentageChange: 0.81, volume: 1200000, chartData: [] },
                { symbol: "BANKBEES", name: "Bank Bees", category: "Equity", price: 485.20, previousClose: 480.50, priceChange: 4.70, percentageChange: 0.98, volume: 850000, chartData: [] },
                { symbol: "GOLDBEES", name: "Gold Bees", category: "Gold", price: 52.80, previousClose: 52.40, priceChange: 0.40, percentageChange: 0.76, volume: 2100000, chartData: [] },
                { symbol: "SILVERBEES", name: "Silver Bees", category: "Gold", price: 98.50, previousClose: 97.20, priceChange: 1.30, percentageChange: 1.34, volume: 650000, chartData: [] },
                { symbol: "ITBEES", name: "IT Bees", category: "Sector", price: 425.60, previousClose: 420.30, priceChange: 5.30, percentageChange: 1.26, volume: 420000, chartData: [] },
                { symbol: "CPSEETF", name: "CPSE ETF", category: "Sector", price: 68.90, previousClose: 68.20, priceChange: 0.70, percentageChange: 1.03, volume: 380000, chartData: [] }
            ]);
        }
        
        // Update cache
        ETF_CACHE = validData;
        ETF_CACHE_TIME = now;
        
        return res.json(validData);
    } catch (error) {
        console.error("ETF API error:", error.message);
        // Return cached data on error
        if (ETF_CACHE.length) {
            return res.json(ETF_CACHE);
        }
        return res.status(500).json({ error: "Unable to fetch ETF data" });
    }
});

// Stock Search API
app.get("/api/search", async (req, res) => {
    try {
        const query = String(req.query.q || "").trim().toLowerCase();
        if (!query || query.length < 1) {
            return res.json([]);
        }

        // Get all NSE stock symbols
        const allSymbols = await nse.getAllStockSymbols();
        const symbols = Array.isArray(allSymbols) ? allSymbols : [];

        // Filter symbols based on search query
        const filteredResults = symbols
            .filter(symbol => {
                const symbolStr = String(symbol || "").toLowerCase();
                return symbolStr.includes(query);
            })
            .slice(0, 20) // Limit to 20 results
            .map(symbol => ({
                symbol: String(symbol).toUpperCase(),
                name: String(symbol), // For now, use symbol as name, could be enhanced later
                type: "Stock"
            }));

        // Also include some common indices
        const indices = [
            { symbol: "NIFTY50", name: "Nifty 50", type: "Index" },
            { symbol: "SENSEX", name: "BSE Sensex", type: "Index" },
            { symbol: "NIFTYBANK", name: "Nifty Bank", type: "Index" },
            { symbol: "NIFTYIT", name: "Nifty IT", type: "Index" },
            { symbol: "NIFTYFINSRV", name: "Nifty Financial Services", type: "Index" }
        ];

        const filteredIndices = indices.filter(index =>
            index.name.toLowerCase().includes(query) ||
            index.symbol.toLowerCase().includes(query)
        );

        // Combine and return results
        const results = [...filteredIndices, ...filteredResults];
        return res.json(results);

    } catch (error) {
        console.error("Search API error:", error.message);
        return res.status(500).json({ error: "Unable to perform search" });
    }
});

connectMongo().finally(() => {
    startSeminarReminderScheduler();

    app.listen(PORT, () => {
        const readiness = getAuthReadiness();
        console.log(`FinEdu server running at http://localhost:${PORT}`);
        console.log("Auth readiness:", readiness.code, readiness.details);
    });
});
