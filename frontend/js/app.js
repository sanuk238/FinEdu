// =========================================================
// frontend/app.js
// Purpose: shared browser behavior used across multiple pages.
// Sections:
// 1) Navigation safety (home redirect rules)
// 2) Home/news widgets loading
// 3) Courses notice persistence (localStorage)
// =========================================================

function getAuthUser() {
    try {
        const raw = localStorage.getItem("finedu_auth_user");
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function isAuthenticated() {
    try {
        return Boolean(localStorage.getItem("finedu_auth_token"));
    } catch (e) {
        return false;
    }
}

function setAuthFlashMessage(message, type = "success") {
    if (!message) return;
    try {
        sessionStorage.setItem("finedu_auth_flash", JSON.stringify({ message, type }));
    } catch (e) {
        // Ignore storage failures gracefully.
    }
}

function consumeAuthFlashMessage() {
    try {
        const raw = sessionStorage.getItem("finedu_auth_flash");
        if (!raw) return null;

        sessionStorage.removeItem("finedu_auth_flash");
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.message) return null;
        return parsed;
    } catch (e) {
        return null;
    }
}

function showAuthPopup(message, type = "success") {
    if (!message) return;

    let popup = document.getElementById("fineduAuthPopup");
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "fineduAuthPopup";
        popup.setAttribute("role", "status");
        popup.setAttribute("aria-live", "polite");
        document.body.appendChild(popup);
    }

    const isSuccess = type === "success";
    popup.textContent = message;
    popup.style.cssText = [
        "position: fixed",
        "top: 24px",
        "left: 50%",
        "transform: translateX(-50%) translateY(-12px)",
        "z-index: 2000",
        "padding: 10px 16px",
        "border-radius: 10px",
        "color: #ffffff",
        `background: ${isSuccess ? "#15803d" : "#b91c1c"}`,
        "box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18)",
        "font-size: 14px",
        "font-weight: 600",
        "opacity: 0",
        "transition: opacity 160ms ease, transform 160ms ease"
    ].join(";");

    requestAnimationFrame(() => {
        popup.style.opacity = "1";
        popup.style.transform = "translateX(-50%) translateY(0)";
    });

    if (window.__fineduAuthPopupTimer) {
        clearTimeout(window.__fineduAuthPopupTimer);
    }

    window.__fineduAuthPopupTimer = setTimeout(() => {
        popup.style.opacity = "0";
        popup.style.transform = "translateX(-50%) translateY(-12px)";
    }, 2200);
}

function clearAuthState() {
    try {
        localStorage.removeItem("finedu_auth_token");
        localStorage.removeItem("finedu_auth_user");
    } catch (e) {
        // Ignore storage failures gracefully.
    }
}

function handleLogoutClick(event) {
    if (event) event.preventDefault();

    clearAuthState();
    setAuthFlashMessage("Logout successful.", "success");
    window.location.href = "/";
}

function enforceHomeOnLaunchAndRefresh() {
    const path = window.location.pathname;
    const isHomePath = path === "/" || path.endsWith("/index.html");
    const isAuthPath = path.includes("/pages/auth.html");
    if (isHomePath || isAuthPath) return;

    const navEntry = performance.getEntriesByType("navigation")[0];
    const navType = navEntry ? navEntry.type : "navigate";
    const isReload = navType === "reload";

    let isInternalReferrer = false;
    if (document.referrer) {
        try {
            isInternalReferrer = new URL(document.referrer).origin === window.location.origin;
        } catch (e) {
            isInternalReferrer = false;
        }
    }

    if (isReload || !isInternalReferrer) {
        window.location.replace("/");
    }
}

function requireAuthForProtectedLinks() {
    document.addEventListener("click", (event) => {
        const anchor = event.target.closest("a[href]");
        if (!anchor) return;

        const href = anchor.getAttribute("href") || "";
        if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

        const isAbsolute = /^https?:\/\//i.test(href);
        if (isAbsolute) {
            try {
                const url = new URL(href);
                if (url.origin !== window.location.origin) return;
            } catch (e) {
                return;
            }
        }

        const toPath = (() => {
            try {
                return new URL(href, window.location.origin).pathname;
            } catch (e) {
                return "";
            }
        })();

        const isAuthPage = toPath.includes("/pages/auth.html");
        const isHomePath = toPath === "/" || toPath.endsWith("/index.html");

        if (isAuthPage || isHomePath) return;
        if (isAuthenticated()) return;

        event.preventDefault();
        window.location.href = "/pages/auth.html";
    });
}

function normalizeSharedNavigation() {
    const navRoot = document.querySelector(".header .nav");
    const navLinks = navRoot?.querySelector(".nav-links");
    const logo = navRoot?.querySelector(".logo");

    if (!navRoot || !navLinks || !logo) return;

    const currentPath = window.location.pathname;
    const navItems = [
        { label: "Home", href: "/" },
        { label: "Screener", href: "/pages/screener.html" },
        { label: "Tools", href: "/pages/tools.html" },
        { label: "Courses", href: "/pages/courses.html" },
        { label: "Learning", href: "/pages/learning.html" },
        { label: "Seminars", href: "/pages/seminars.html" },
        { label: "News", href: "/pages/news.html" }
    ];

    const isActiveLink = (href) => {
        if (href === "/") {
            return currentPath === "/" || currentPath.endsWith("/index.html");
        }
        return currentPath === href;
    };

    navLinks.innerHTML = `
        <ul>
            ${navItems.map((item) => `
                <li>
                    <a href="${item.href}"${isActiveLink(item.href) ? ' class="active"' : ""}>${item.label}</a>
                </li>
            `).join("")}
        </ul>
    `;

    let authAction = navRoot.querySelector(".nav-auth-btn") || navRoot.querySelector(":scope > a.btn.small");
    if (!authAction) {
        authAction = document.createElement("a");
        authAction.className = "btn small nav-auth-btn";
        navRoot.appendChild(authAction);
    } else {
        authAction.classList.add("nav-auth-btn");
    }

    if (logo.nextElementSibling !== navLinks) {
        navRoot.insertBefore(navLinks, authAction);
    }
}

function updateHomeWelcomeCTA() {
    const headerCta = document.querySelector(".header .nav > a.nav-auth-btn");
    if (!headerCta) return;

    headerCta.style.visibility = "";
    headerCta.style.width = "";
    headerCta.style.padding = "";
    headerCta.style.margin = "";

    if (isAuthenticated()) {
        headerCta.textContent = "Logout";
        headerCta.setAttribute("href", "javascript:void(0)");
        headerCta.setAttribute("aria-label", "Logout");
        headerCta.onclick = handleLogoutClick;
    } else {
        headerCta.textContent = "Login";
        headerCta.setAttribute("href", "/pages/auth.html");
        headerCta.setAttribute("aria-label", "Login");
        headerCta.onclick = null;
    }
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

const BASE_API_URL = (
    window.BASE_API_URL
    || window.__ENV__?.BASE_API_URL
    || ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000"
        : "https://finedu-backend-i4fm.onrender.com")
).replace(/\/$/, "");

function getSafeExternalLink(value) {
    const url = String(value || "").trim();
    if (!url) return "#";
    if (/^https?:\/\//i.test(url)) return url;
    return "#";
}

// ---------------- FINANCE NEWS ----------------
async function loadFinanceNews() {
    const container = document.getElementById("news-container");
    if (!container) return;

    try {
        const res = await fetch(`${BASE_API_URL}/api/news`);
        const data = await res.json();

        const items = Array.isArray(data?.data)
            ? data.data
            : (Array.isArray(data?.conversations) ? data.conversations : []);

        if (!items.length) {
            container.innerHTML = "<p>No news available.</p>";
            return;
        }

        container.innerHTML = "";

        items.slice(0, 12).forEach(post => {
            const div = document.createElement("div");
            div.className = "news-card";

            const source = escapeHtml(stripHtml(post.source || post.user?.nickname || "FinEdu"));
            const title = escapeHtml(stripHtml(post.title || "Market Update"));
            const summary = escapeHtml(stripHtml(post.summary || post.content?.text || "No content available"));
            const published = post.published || post.meta?.createdAt;
            const safePublished = published ? escapeHtml(new Date(published).toLocaleDateString()) : "";
            const link = getSafeExternalLink(post.link);
            const safeLink = escapeHtml(link);

            div.innerHTML = `
                <div class="news-user">
                    ${source}
                </div>
                <div class="news-title">
                    ${title}
                </div>
                <div class="news-text">
                    ${summary}
                </div>
                <div class="news-meta">
                    <span>${safePublished}</span>
                    <span>${link !== "#" ? `<a href="${safeLink}" target="_blank" rel="noopener noreferrer">Read more</a>` : ""}</span>
                </div>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.error("Failed to load finance news:", err);
        container.innerHTML = "<p>Failed to load news.</p>";
    }
}

// ---------------- MARKET TICKER ----------------

// Mock market data - in production, this would come from an API
const mockMarketData = [
    { symbol: "NIFTY 50", price: "22,450.75", change: "+1.25%", changeValue: 1.25 },
    { symbol: "SENSEX", price: "73,890.45", change: "+0.95%", changeValue: 0.95 },
    { symbol: "BANKNIFTY", price: "47,230.80", change: "-0.45%", changeValue: -0.45 },
    { symbol: "USDINR", price: "83.25", change: "+0.15%", changeValue: 0.15 },
    { symbol: "GOLD", price: "6,850", change: "+0.85%", changeValue: 0.85 },
    { symbol: "CRUDE", price: "5,420", change: "-1.20%", changeValue: -1.20 }
];

function createMarketTickerItem(data) {
    const changeClass = data.changeValue >= 0 ? 'positive' : 'negative';
    return `
        <div class="market-item">
            <span class="market-symbol">${data.symbol}</span>
            <span class="market-price">${data.price}</span>
            <span class="market-change ${changeClass}">${data.change}</span>
        </div>
    `;
}

function initializeMarketTicker() {
    const tickerContent = document.getElementById('ticker-content');
    if (!tickerContent) return;

    // Create ticker items
    const tickerItems = mockMarketData.map(createMarketTickerItem).join('');
    
    // Duplicate items for seamless scrolling
    tickerContent.innerHTML = tickerItems + tickerItems;
}

function updateMarketData() {
    // Simulate real-time updates (in production, fetch from API)
    mockMarketData.forEach(item => {
        // Random small price movements
        const randomChange = (Math.random() - 0.5) * 0.5; // -0.25% to +0.25%
        item.changeValue += randomChange;
        
        // Update price based on change
        const basePrice = parseFloat(item.price.replace(/,/g, ''));
        const newPrice = basePrice * (1 + item.changeValue / 100);
        
        // Format price based on symbol
        if (item.symbol.includes('NIFTY') || item.symbol === 'SENSEX') {
            item.price = newPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 });
        } else if (item.symbol === 'USDINR') {
            item.price = newPrice.toFixed(2);
        } else {
            item.price = Math.round(newPrice).toLocaleString('en-IN');
        }
        
        item.change = `${item.changeValue >= 0 ? '+' : ''}${item.changeValue.toFixed(2)}%`;
    });
    
    // Reinitialize ticker with updated data
    initializeMarketTicker();
}

function ensureSharedChatbot() {
    if (document.querySelector('.floating-chat-btn') || document.querySelector('.chat-popup')) {
        return;
    }

    const chatMarkup = `
        <button class="floating-chat-btn" aria-label="Open AI Assistant">
            <img src="/assets/ai svg.png" alt="AI Assistant" />
        </button>

        <div class="chat-popup">
            <div class="chat-popup-header">
                <div class="chat-header-info">
                    <div class="chat-header-avatar" aria-hidden="true">
                        <img src="/assets/ai svg.png" alt="" />
                    </div>
                    <div class="chat-header-copy">
                        <h2>FinEdu Assistant</h2>
                        <p>AI Financial Guide</p>
                    </div>
                </div>
                <button class="close-chat-btn" aria-label="Close AI Assistant">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="chat-app">
                <div id="welcomeScreen" class="welcome-screen">
                    <div class="welcome-stack">
                        <div class="welcome-bot-row">
                            <div class="welcome-avatar welcome-icon" aria-hidden="true">
                                <img src="/assets/ai svg.png" alt="" />
                            </div>
                            <div class="welcome-bubble">
                                <p>Welcome ≡ƒæï</p>
                                <p>How can I help you today?</p>
                            </div>
                        </div>

                        <div id="suggestionCards" class="suggestion-chips" aria-label="Quick suggestions">
                            <button class="suggestion-card" data-prompt="Learn investing basics">Learn investing basics</button>
                            <button class="suggestion-card" data-prompt="Calculate EMI">Calculate EMI</button>
                            <button class="suggestion-card" data-prompt="Understand SIP">Understand SIP</button>
                            <button class="suggestion-card" data-prompt="Plan retirement">Plan retirement</button>
                            <button class="suggestion-card" data-prompt="Ask about stock market">Ask about stock market</button>
                        </div>
                    </div>
                </div>
                <div id="chatMessages" class="chat-messages"></div>
                <div class="chat-composer">
                    <div class="chat-actions">
                        <button class="chat-action-btn" id="helpBtn">≡ƒô₧ Support</button>
                        <button class="chat-action-btn" id="newChatBtn">≡ƒöä New Chat</button>
                    </div>
                    <form id="chatForm" class="chat-input-wrapper">
                        <textarea id="chatInput" placeholder="Ask about finance, investing, or planning..." rows="1"></textarea>
                        <button type="submit" class="send-btn" disabled="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                    <p class="chat-disclaimer">FinEdu AI provides educational guidance only and not financial advice.</p>
                </div>
            </div>
        </div>
    `;

    const footer = document.querySelector('.footer');
    if (footer) {
        footer.insertAdjacentHTML('beforebegin', chatMarkup);
    } else {
        document.body.insertAdjacentHTML('beforeend', chatMarkup);
    }
}

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", () => {
    enforceHomeOnLaunchAndRefresh();
    requireAuthForProtectedLinks();
    normalizeSharedNavigation();
    updateHomeWelcomeCTA();

    const authFlash = consumeAuthFlashMessage();
    if (authFlash?.message) {
        showAuthPopup(authFlash.message, authFlash.type || "success");
    }

    // Initialize market ticker
    initializeMarketTicker();
    
    // Update market data every 30 seconds
    setInterval(updateMarketData, 30000);

    if (document.body.classList.contains('page-home')) {
        loadFinanceNews();
    }

    ensureSharedChatbot();

    // hide the course notice if user already dismissed it previously
    try {
        if (localStorage.getItem('finedu_courses_notice_seen_v1')) {
            const notice = document.getElementById('courseNotice');
            if (notice) notice.style.display = 'none';
        }
    } catch (e) { /* ignore storage errors */ }

    // wire up the close button to hide and remember the choice
    const courseClose = document.getElementById('closeNotice');
    courseClose?.addEventListener('click', () => {
        try { localStorage.setItem('finedu_courses_notice_seen_v1', '1'); } catch (e) { }
        const notice = document.getElementById('courseNotice');
        if (notice) notice.style.display = 'none';
    });

    const floatingChatBtn = document.querySelector('.floating-chat-btn');
    const closeChatBtn = document.querySelector('.close-chat-btn');
    const chatPopup = document.querySelector('.chat-popup');
    const newChatBtn = document.getElementById('newChatBtn');
    const helpBtn = document.getElementById('helpBtn');

    const updateChatHeaderHeight = () => {
        const header = document.querySelector('.header');
        const fallbackHeight = 88;

        if (!header) {
            document.documentElement.style.setProperty('--chat-header-height', `${fallbackHeight}px`);
            return;
        }

        const rect = header.getBoundingClientRect();
        const topOffset = Math.max(0, Math.round(rect.bottom));
        document.documentElement.style.setProperty('--chat-header-height', `${topOffset || fallbackHeight}px`);
    };

    const syncChatLayoutState = () => {
        if (!chatPopup) return;

        const isOpen = chatPopup.classList.contains('show-chat');
        document.body.classList.toggle('chat-open', isOpen);

        if (isOpen) {
            updateChatHeaderHeight();
        }
    };

    if (floatingChatBtn && closeChatBtn && chatPopup) {
        floatingChatBtn.addEventListener('click', () => {
            chatPopup.classList.toggle('show-chat');
            syncChatLayoutState();
        });

        closeChatBtn.addEventListener('click', () => {
            chatPopup.classList.remove('show-chat');
            syncChatLayoutState();
        });

        updateChatHeaderHeight();
        syncChatLayoutState();

        window.addEventListener('resize', updateChatHeaderHeight);
        window.addEventListener('scroll', () => {
            if (chatPopup.classList.contains('show-chat')) {
                updateChatHeaderHeight();
            }
        }, { passive: true });
    }

    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            const chatMessages = document.getElementById('chatMessages');
            const welcomeScreen = document.getElementById('welcomeScreen');
            if (chatMessages && welcomeScreen) {
                chatMessages.innerHTML = '';
                welcomeScreen.style.display = 'flex';
            }
        });
    }

    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            alert('Support: +91 7798577682');

            const welcomeIcon = document.querySelector('.welcome-icon');
            if (welcomeIcon) {
                welcomeIcon.style.display = 'none';
            }

            if (chatPopup) {
                chatPopup.classList.add('support-mode');
            }
        });
    }
});

