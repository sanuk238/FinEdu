const urlParams = new URLSearchParams(window.location.search);
const symbol = (urlParams.get("symbol") || "RELIANCE").toUpperCase();
const BASE_API_URL = (
    window.BASE_API_URL
    || window.__ENV__?.BASE_API_URL
    || ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000"
        : "https://finedu-api.onrender.com")
).replace(/\/$/, "");

const headerEls = {
    exchange: document.getElementById("stockExchange"),
    ticker: document.getElementById("stockTicker"),
    name: document.getElementById("stockName"),
    price: document.getElementById("stockPrice"),
    change: document.getElementById("stockChange"),
    dayRange: document.getElementById("stockDayRange"),
    weekRange: document.getElementById("stockWeekRange"),
    description: document.getElementById("stockDescription")
};

const summaryEls = {
    price: document.getElementById("summaryPrice"),
    change: document.getElementById("summaryChange"),
    marketCap: document.getElementById("summaryMarketCap"),
    peRatio: document.getElementById("summaryPERatio"),
    eps: document.getElementById("summaryEPS"),
    roe: document.getElementById("summaryROE"),
    dayRange: document.getElementById("summaryDayRange"),
    weekRange: document.getElementById("summaryWeekRange")
};

const chartContainer = document.getElementById("stockChart");
const sectionNavLinks = Array.from(document.querySelectorAll(".stock-section-nav .category-tab"));
const timeframeButtons = Array.from(document.querySelectorAll(".timeframe-btn"));
const peerEls = {
    tbody: document.getElementById("peerTableBody"),
    sector: document.getElementById("peersSector"),
    headers: Array.from(document.querySelectorAll(".peer-table th.sortable"))
};

const chartIntervalMap = {
    "1D": "5",
    "5D": "30",
    "1M": "D",
    "6M": "W",
    "1Y": "W",
    "5Y": "M",
    MAX: "M"
};

let peerRows = [];
let peerSort = { key: "marketCap", direction: "desc" };
let activeChartRange = "1D";
let lastChartIsMobile = null;
let resizeTimer = null;

function getTradingViewSymbol(rawSymbol) {
    const clean = String(rawSymbol || "").trim().toUpperCase();
    if (!clean) return "NSE:RELIANCE";

    // Keep exchange-prefixed symbols as-is and default plain symbols to NSE.
    if (clean.includes(":")) return clean;
    return `NSE:${clean}`;
}

function loadTradingViewScript() {
    if (window.TradingView) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load TradingView script."));
        document.head.appendChild(script);
    });
}

async function initTradingViewChart() {
    if (!chartContainer) return;

    try {
        const tvSymbol = getTradingViewSymbol(symbol);
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const interval = chartIntervalMap[activeChartRange] || "D";
        lastChartIsMobile = isMobile;

        chartContainer.style.height = `${isMobile ? 350 : 500}px`;
        chartContainer.innerHTML = "";

        await loadTradingViewScript();
        new window.TradingView.widget({
            container_id: "stockChart",
            symbol: tvSymbol,
            interval,
            style: "1",
            locale: "en",
            timezone: "Asia/Kolkata",
            theme: "light",
            width: "100%",
            height: isMobile ? 350 : 500,
            autosize: false,
            withdateranges: true,
            hide_legend: false,
            hide_side_toolbar: false,
            allow_symbol_change: false,
            details: true,
            studies: ["Volume@tv-basicstudies"]
        });
    } catch (error) {
        chartContainer.textContent = "Unable to load chart right now.";
    }
}

function formatCurrency(value) {
    if (typeof value !== "number") return "--";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(value);
}

function formatMarketCap(value) {
    if (typeof value !== "number") return "--";
    return new Intl.NumberFormat("en-IN", {
        notation: "compact",
        maximumFractionDigits: 2
    }).format(value);
}

function formatNumber(value, decimals = 2, suffix = "") {
    if (typeof value !== "number") return "--";
    return `${value.toFixed(decimals)}${suffix}`;
}

function formatRange(low, high, fallbackValue) {
    if (typeof low === "number" && typeof high === "number") {
        return `${formatCurrency(low)} - ${formatCurrency(high)}`;
    }
    if (typeof fallbackValue === "number") {
        return formatCurrency(fallbackValue);
    }
    return "--";
}

function renderSummary(payload) {
    if (!summaryEls.price) return;

    summaryEls.price.textContent = formatCurrency(payload.price);
    const changeText = typeof payload.changePercent === "number"
        ? `${payload.changePercent >= 0 ? "+" : ""}${payload.changePercent.toFixed(2)}%`
        : "--";
    summaryEls.change.textContent = changeText;
    setChangeClass(summaryEls.change, changeText);
    summaryEls.marketCap.textContent = formatMarketCap(payload.marketCap);
    summaryEls.peRatio.textContent = formatNumber(payload.peRatio);
    summaryEls.eps.textContent = formatNumber(payload.eps);
    summaryEls.roe.textContent = formatNumber(payload.roe, 2, "%");
    summaryEls.dayRange.textContent = formatRange(payload.dayLow, payload.dayHigh, payload.price);
    summaryEls.weekRange.textContent = formatRange(payload.low52, payload.high52);
}

function setChangeClass(element, value) {
    if (!element) return;

    const text = String(value || "");
    element.classList.remove("positive", "negative", "neutral");

    if (text.startsWith("+")) {
        element.classList.add("positive");
        return;
    }
    if (text.startsWith("-")) {
        element.classList.add("negative");
        return;
    }
    element.classList.add("neutral");
}

function comparePeerRows(a, b, key, direction) {
    const dir = direction === "asc" ? 1 : -1;
    const av = a?.[key];
    const bv = b?.[key];

    if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
    }
    return String(av || "").localeCompare(String(bv || "")) * dir;
}

function renderPeerTable() {
    if (!peerEls.tbody) return;
    peerEls.tbody.innerHTML = "";

    const rows = [...peerRows].sort((a, b) => comparePeerRows(a, b, peerSort.key, peerSort.direction));
    rows.forEach((row) => {
        const tr = document.createElement("tr");
        if (row.isSelected || String(row.symbol || "").toUpperCase() === symbol) {
            tr.classList.add("selected-peer");
        }

        tr.innerHTML = `
            <td>${row.company || row.symbol || "--"}</td>
            <td>${formatCurrency(row.price)}</td>
            <td>${formatNumber(row.pe)}</td>
            <td>${formatMarketCap(row.marketCap)}</td>
            <td>${row.sector || "--"}</td>
        `;
        peerEls.tbody.appendChild(tr);
    });
}

function updatePeerSortUi() {
    peerEls.headers.forEach((header) => {
        const key = header.getAttribute("data-sort-key");
        const icon = header.querySelector(".peer-sort-icon");
        const isActive = key === peerSort.key;

        header.classList.toggle("sorted-active", isActive);
        if (icon) {
            icon.textContent = isActive ? (peerSort.direction === "asc" ? "↑" : "↓") : "";
        }
    });
}

function initPeerSorting() {
    peerEls.headers.forEach((header) => {
        header.addEventListener("click", () => {
            const key = header.getAttribute("data-sort-key");
            if (!key) return;

            if (peerSort.key === key) {
                peerSort.direction = peerSort.direction === "asc" ? "desc" : "asc";
            } else {
                peerSort.key = key;
                peerSort.direction = "desc";
            }
            updatePeerSortUi();
            renderPeerTable();
        });
    });

    updatePeerSortUi();
}

function updateTimeframeButtons() {
    timeframeButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.range === activeChartRange);
    });
}

function initTimeframeSelector() {
    timeframeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const nextRange = button.dataset.range;
            if (!nextRange || nextRange === activeChartRange) return;

            activeChartRange = nextRange;
            updateTimeframeButtons();
            initTradingViewChart();
        });
    });

    updateTimeframeButtons();
}

function initSectionNav() {
    if (!sectionNavLinks.length) return;

    sectionNavLinks.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.section;
            if (!targetId) return;

            const target = document.getElementById(targetId);
            if (!target) return;

            // Remove active class from all buttons
            sectionNavLinks.forEach((btn) => btn.classList.remove("active"));
            // Add active to clicked button
            button.classList.add("active");

            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    const sections = sectionNavLinks
        .map((button) => document.getElementById(button.dataset.section))
        .filter(Boolean);

    if (!sections.length || typeof IntersectionObserver !== "function") return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const targetId = entry.target.id;
            sectionNavLinks.forEach((button) => {
                button.classList.toggle("active", button.dataset.section === targetId);
            });
        });
    }, {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0.05
    });

    sections.forEach((section) => observer.observe(section));
}

function showUnavailableState() {
    if (headerEls.exchange) headerEls.exchange.textContent = "NSE";
    headerEls.ticker.textContent = symbol;
    headerEls.name.textContent = "Stock data unavailable";
    headerEls.price.textContent = "--";
    headerEls.change.textContent = "--";
    headerEls.dayRange.textContent = "--";
    headerEls.weekRange.textContent = "--";
    setChangeClass(headerEls.change, "");
    headerEls.description.textContent = "Stock data unavailable";

    if (summaryEls.price) {
        summaryEls.price.textContent = "--";
        summaryEls.change.textContent = "--";
        setChangeClass(summaryEls.change, "");
        summaryEls.marketCap.textContent = "--";
        summaryEls.peRatio.textContent = "--";
        summaryEls.eps.textContent = "--";
        summaryEls.roe.textContent = "--";
        summaryEls.dayRange.textContent = "--";
        summaryEls.weekRange.textContent = "--";
    }
}

async function loadStockData() {
    try {
        const res = await fetch(`${BASE_API_URL}/api/stock/${encodeURIComponent(symbol)}`);
        const payload = await res.json();

        if (!res.ok || !payload) {
            throw new Error(payload?.error || "Stock data unavailable");
        }

        const changePercent = typeof payload.changePercent === "number"
            ? `${payload.changePercent >= 0 ? "+" : ""}${payload.changePercent.toFixed(2)}%`
            : "--";

        headerEls.exchange.textContent = payload.exchange || "NSE";
        headerEls.ticker.textContent = payload.symbol || symbol;
        headerEls.name.textContent = payload.name || `${symbol} Ltd.`;
        headerEls.price.textContent = formatCurrency(payload.price);
        headerEls.change.textContent = changePercent;
        headerEls.dayRange.textContent = formatRange(payload.dayLow, payload.dayHigh, payload.price);
        headerEls.weekRange.textContent = formatRange(payload.low52, payload.high52);
        setChangeClass(headerEls.change, changePercent);
        headerEls.description.textContent = payload.description || "Stock data unavailable";

        renderSummary(payload);
    } catch (error) {
        showUnavailableState();
    }
}

async function loadPeerData() {
    if (!peerEls.tbody || !peerEls.sector) return;

    try {
        const res = await fetch(`${BASE_API_URL}/api/stock/${encodeURIComponent(symbol)}/peers`);
        const payload = await res.json();
        if (!res.ok || !payload) throw new Error(payload?.error || "Peer data unavailable");

        peerRows = Array.isArray(payload.data) ? payload.data.slice(0, 10) : [];
        peerEls.sector.textContent = `Sector: ${payload.sector || "Unknown"} | Showing ${peerRows.length} companies`;

        if (!peerRows.length) {
            peerEls.tbody.innerHTML = '<tr><td colspan="5">No peer data available.</td></tr>';
            return;
        }

        updatePeerSortUi();
        renderPeerTable();
    } catch (error) {
        peerEls.sector.textContent = "Peer data unavailable.";
        peerEls.tbody.innerHTML = '<tr><td colspan="5">Peer data unavailable.</td></tr>';
    }
}

window.addEventListener("DOMContentLoaded", () => {
    initPeerSorting();
    initTimeframeSelector();
    initSectionNav();
    initTradingViewChart();
    loadStockData();
    loadPeerData();
});

window.addEventListener("resize", () => {
    if (!chartContainer) return;
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (lastChartIsMobile !== isMobile) {
            initTradingViewChart();
            return;
        }
        chartContainer.style.height = `${isMobile ? 350 : 500}px`;
    }, 120);
});
