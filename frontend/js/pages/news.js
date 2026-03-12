// =========================================================
// frontend/pages/news.js
// Purpose: fetch and render finance news cards on News page.
// Flow:
// 1) Fetch /api/news
// 2) Render cards + timestamps
// 3) Auto refresh at fixed interval
// =========================================================

const container = document.getElementById("news-container");
const lastUpdatedEl = document.getElementById("last-updated");
const refreshCountdownEl = document.getElementById("refresh-countdown");
const trendingContainer = document.getElementById("trending-container");
const filterButtons = document.querySelectorAll(".news-filter-btn");
const newsCountEl = document.getElementById("news-count");
const RETRY_DELAY_MS = 15000;
const REFRESH_INTERVAL_MS = 20 * 60 * 1000;
const BOOKMARK_KEY = "finedu_news_bookmarks_v1";
const BASE_API_URL = (
    window.BASE_API_URL
    || window.__ENV__?.BASE_API_URL
    || ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000"
        : "https://finedu-backend-i4fm.onrender.com")
).replace(/\/$/, "");

let allProcessedItems = [];
let activeFilter = "All";
let nextRefreshAt = Date.now() + REFRESH_INTERVAL_MS;

const impactRules = {
    Banking: ["bank", "banking", "loan", "rbi", "interest rate", "nbfc"],
    Crypto: ["crypto", "bitcoin", "ethereum", "token", "blockchain"],
    Commodity: ["commodity", "crude", "oil", "gold", "silver", "metal", "copper"],
    Global: ["us", "fed", "china", "europe", "global", "world", "geopolitical"],
    "High Impact": ["surge", "crash", "plunge", "rally", "record", "ban", "war", "rate hike", "inflation"]
};

const sentimentLexicon = {
    positive: ["gain", "gains", "rally", "up", "growth", "strong", "beat", "record high", "bull"],
    negative: ["fall", "falls", "drop", "drops", "crash", "slump", "weak", "miss", "loss", "bear"],
};

const stockUniverse = [
    "VEDL", "HINDALCO", "NALCO", "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN",
    "ADANIENT", "ADANIPORTS", "TATASTEEL", "LT", "ITC", "BHARTIARTL", "MARUTI", "ASIANPAINT", "HCLTECH", "BAJFINANCE", "KOTAKBANK"
];

function readBookmarks() {
    try {
        const parsed = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]");
        return Array.isArray(parsed) ? new Set(parsed) : new Set();
    } catch {
        return new Set();
    }
}

function writeBookmarks(bookmarkSet) {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(Array.from(bookmarkSet)));
}

function buildNewsId(item) {
    return item.link || `${item.title || "untitled"}-${item.published || ""}`;
}

function lowerText(value) {
    return String(value || "").toLowerCase();
}

function stripHtml(value) {
    return String(value || "")
        .replace(/<img\b[^>]*>/gi, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getSafeExternalLink(value) {
    const url = String(value || "").trim();
    if (!url) return "#";
    if (/^https?:\/\//i.test(url)) return url;
    return "#";
}

function deriveImpactTags(item) {
    const text = `${item.title || ""} ${item.summary || ""}`.toLowerCase();
    const tags = [];

    Object.entries(impactRules).forEach(([tag, words]) => {
        if (words.some((word) => text.includes(word))) {
            tags.push(tag);
        }
    });

    return tags;
}

function deriveSentiment(item) {
    const text = lowerText(item.title);
    const pos = sentimentLexicon.positive.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0);
    const neg = sentimentLexicon.negative.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0);

    if (pos > neg) return "Positive";
    if (neg > pos) return "Negative";
    return "Neutral";
}

function deriveFilterCategory(impactTags) {
    if (impactTags.includes("Banking")) return "Banking";
    if (impactTags.includes("Crypto")) return "Crypto";
    if (impactTags.includes("Commodity")) return "Commodities";
    if (impactTags.includes("Global")) return "Global";
    return "Markets";
}

function deriveRelatedStocks(item) {
    const text = `${item.title || ""} ${item.summary || ""}`.toUpperCase();
    return stockUniverse.filter((stock) => text.includes(stock));
}

function deriveTLDR(item) {
    const sourceText = String(item.summary || item.title || "").trim();
    if (!sourceText) return "TLDR: Update available in the full article.";

    const candidates = sourceText.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
    const sentence = candidates.find((line) => line.length > 24) || candidates[0] || sourceText;
    return `TLDR: ${sentence.replace(/\s+/g, " ")}`;
}

function impactScore(item) {
    let score = 0;
    if (item.impactTags.includes("High Impact")) score += 3;
    if (item.sentiment === "Positive" || item.sentiment === "Negative") score += 1;
    if (item.relatedStocks.length) score += 1;
    return score;
}

function renderMessage(message) {
    if (!container) return;
    container.innerHTML = `<p class="news-empty">${message}</p>`;
    if (trendingContainer) {
        trendingContainer.innerHTML = "";
    }
    if (newsCountEl) {
        newsCountEl.textContent = "";
    }
}

function updateLastUpdated(ts) {
    if (!lastUpdatedEl || !ts) return;
    const time = new Date(ts).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
    lastUpdatedEl.textContent = `Last updated at ${time}`;
}

function updateRefreshCountdown() {
    if (!refreshCountdownEl) return;
    const msLeft = Math.max(0, nextRefreshAt - Date.now());
    const totalSeconds = Math.ceil(msLeft / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    refreshCountdownEl.textContent = `Next refresh in ${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function renderTrending(items) {
    if (!trendingContainer) return;
    const topItems = [...items]
        .sort((a, b) => impactScore(b) - impactScore(a))
        .slice(0, 3);

    if (!topItems.length) {
        trendingContainer.innerHTML = "<p class=\"news-empty\">No trending stories right now.</p>";
        return;
    }

    trendingContainer.innerHTML = topItems
        .map((item) => {
            const safeSource = escapeHtml(stripHtml(item.source || "FinEdu"));
            const safeTitle = escapeHtml(stripHtml(item.title || "Untitled"));
            const safeTldr = escapeHtml(stripHtml(item.tldr || ""));

            return `
            <article class="trending-card">
                <span class="news-source">${safeSource}</span>
                <h3>${safeTitle}</h3>
                <p>${safeTldr}</p>
            </article>
        `;
        })
        .join("");
}

function renderNewsCards(items) {
    if (!container) return;
    const bookmarks = readBookmarks();
    container.innerHTML = "";

    if (!items.length) {
        container.innerHTML = "<p class=\"news-empty\">No stories match this filter.</p>";
        if (newsCountEl) newsCountEl.textContent = "0 stories";
        return;
    }

    if (newsCountEl) {
        newsCountEl.textContent = `${items.length} stories`;
    }

    items.forEach((item, index) => {
        const newsId = buildNewsId(item);
        const isBookmarked = bookmarks.has(newsId);

        const card = document.createElement("div");
        card.className = `news-card${isBookmarked ? " bookmarked" : ""}`;
        card.style.animationDelay = `${index * 0.05}s`;

        const impactTagsHtml = item.impactTags
            .map((tag) => `<span class="impact-tag${tag === "High Impact" ? " impact-high" : ""}">${escapeHtml(tag)}</span>`)
            .join("");

        const sentimentClass = item.sentiment.toLowerCase();
        const safeSource = escapeHtml(stripHtml(item.source || "FinEdu"));
        const safeTitle = escapeHtml(stripHtml(item.title || "Untitled"));
        const safeTldr = escapeHtml(stripHtml(item.tldr || ""));
        const safeSummary = escapeHtml(stripHtml(item.summary || "No summary available."));
        const safeSentiment = escapeHtml(stripHtml(item.sentiment || "Neutral"));
        const safePublished = escapeHtml(stripHtml(item.published || ""));
        const safeLink = escapeHtml(getSafeExternalLink(item.link));
        const relatedStocksHtml = item.relatedStocks.length
            ? `
                <div class="related-stock-wrap">
                  <div class="related-title">Related Stocks</div>
                  <div class="related-stocks">
                    ${item.relatedStocks
                        .map((symbol) => `<a class="related-stock-tag" href="/pages/stock.html?symbol=${encodeURIComponent(symbol)}">${symbol}</a>`)
                        .join("")}
                  </div>
                </div>
              `
            : "";

        card.innerHTML = `
          <div class="news-card-top">
                        <span class="news-source">${safeSource}</span>
            <button class="bookmark-btn${isBookmarked ? " active" : ""}" data-id="${newsId}" aria-label="Bookmark this news">${isBookmarked ? "Γÿà" : "Γÿå"}</button>
          </div>
          <div>
                        <div class="news-title">${safeTitle}</div>
                        <div class="news-tldr">${safeTldr}</div>
                        <div class="news-text">${safeSummary}</div>
            <div class="news-badges">
                            <span class="news-badge sentiment-${sentimentClass}">${safeSentiment}</span>
            </div>
            <div class="news-impact-tags">${impactTagsHtml}</div>
            ${relatedStocksHtml}
          </div>
          <div class="news-meta">
                        <span>${safePublished}</span>
                        <a href="${safeLink}" target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        `;

        container.appendChild(card);
    });
}

function applyActiveFilter() {
    const filtered = activeFilter === "All"
        ? allProcessedItems
        : allProcessedItems.filter((item) => item.filterCategory === activeFilter);
    renderNewsCards(filtered);
}

function bindNewsInteractions() {
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.getAttribute("data-filter") || "All";
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            applyActiveFilter();
        });
    });

    container?.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (!target.classList.contains("bookmark-btn")) return;
        const newsId = target.getAttribute("data-id");
        if (!newsId) return;

        const bookmarks = readBookmarks();
        if (bookmarks.has(newsId)) {
            bookmarks.delete(newsId);
        } else {
            bookmarks.add(newsId);
        }
        writeBookmarks(bookmarks);
        applyActiveFilter();
    });
}

async function loadNews() {
    if (!container) return;

    try {
        renderMessage("Loading latest finance news...");

        const res = await fetch(`${BASE_API_URL}/api/news`);
        const result = await res.json().catch(() => ({}));

        if (!res.ok) {
            if (res.status === 503) {
                renderMessage("News is loading. Retrying shortly...");
                setTimeout(loadNews, RETRY_DELAY_MS);
                return;
            }
            throw new Error(result.error || "News request failed");
        }

        const items = Array.isArray(result.data) ? result.data : [];
        if (!items.length) {
            renderMessage("No news available right now.");
            return;
        }

        allProcessedItems = items.map((item) => {
            const impactTags = deriveImpactTags(item);
            return {
                ...item,
                impactTags,
                sentiment: deriveSentiment(item),
                relatedStocks: deriveRelatedStocks(item),
                tldr: deriveTLDR(item),
                filterCategory: deriveFilterCategory(impactTags),
            };
        });

        nextRefreshAt = Date.now() + REFRESH_INTERVAL_MS;

        updateLastUpdated(result.lastUpdated);
        renderTrending(allProcessedItems);
        applyActiveFilter();
    } catch (err) {
        console.error("Failed to load news:", err);
        renderMessage("Failed to load news. Retrying...");
        setTimeout(loadNews, RETRY_DELAY_MS);
    }
}

bindNewsInteractions();

// Initial load
loadNews();
updateRefreshCountdown();

setInterval(updateRefreshCountdown, 1000);

// Auto refresh every 20 minutes
setInterval(loadNews, REFRESH_INTERVAL_MS);

