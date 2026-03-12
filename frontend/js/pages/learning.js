const learningBasicModules = [
    {
        id: "pf-basic",
        number: 1,
        color: "#4ade80",
        title: "Personal Finance - Basic Level",
        description: "Build strong money habits with budgeting, savings, loans, taxes, and insurance fundamentals.",
        chapters: [
            {
                id: "pf-1",
                title: "Introduction to Personal Finance",
                text: "Personal finance is the practice of managing your income, expenses, savings, and future goals in a structured way. Financial literacy matters because it helps you avoid debt traps, poor spending choices, and emotional money decisions. The first step is to understand where your money comes from, where it goes, and how much you can allocate to essential needs, flexible spending, and savings every month. Once this is clear, you can build a realistic budget and stay consistent.",
                focus: ["Income and expense tracking", "Budget structure", "Financial discipline"],
                quiz: [
                    { q: "What is the first step in personal finance?", o: ["Track income and expenses", "Buy high-risk stocks", "Take a new loan"], a: 0 },
                    { q: "Why is financial literacy important?", o: ["It removes all risk", "It improves decision quality", "It guarantees profit"], a: 1 },
                    { q: "A useful monthly budget should include:", o: ["Only entertainment spending", "Needs, wants, and savings", "No savings plan"], a: 1 }
                ]
            },
            {
                id: "pf-2",
                title: "Savings & Banking Basics",
                text: "Savings create stability and reduce financial stress during emergencies. You should understand the use of savings, salary, and current accounts and choose the right account for your needs. A practical savings method is 'pay yourself first', where a fixed amount is saved before optional expenses. A strong emergency fund usually covers 3 to 6 months of required monthly costs, so temporary income shocks do not force you into high-interest borrowing.",
                focus: ["Bank account types", "Emergency fund", "Pay yourself first"],
                quiz: [
                    { q: "An emergency fund is mainly used for:", o: ["Speculative trading", "Unexpected expenses", "Luxury purchases"], a: 1 },
                    { q: "How many months of expenses are commonly recommended?", o: ["3 to 6 months", "1 month only", "12 years"], a: 0 },
                    { q: "A strong savings habit starts with:", o: ["Saving after all spending", "Saving first each month", "No fixed plan"], a: 1 }
                ]
            },
            {
                id: "pf-3",
                title: "Loans & EMI Practical Understanding",
                text: "Loans can help fund planned goals like homes, vehicles, or temporary needs, but only when repayment capacity is clear. Personal loans usually have higher interest than secured loans like home loans. EMI should fit your monthly cash flow comfortably after essential expenses and savings. Before taking any loan, compare total interest cost, tenure, penalties, and processing charges. Use EMI calculators to test affordability under different rates and durations.",
                focus: ["Loan types", "EMI affordability", "Cost comparison"],
                quiz: [
                    { q: "Which loan generally has lower interest?", o: ["Home loan", "Personal loan", "Neither"], a: 0 },
                    { q: "EMI planning should be based on:", o: ["Peer pressure", "Monthly cash flow", "Random guess"], a: 1 },
                    { q: "Before borrowing, you should compare:", o: ["Only the loan amount", "Total cost and tenure", "Logo color of lender"], a: 1 }
                ]
            },
            {
                id: "pf-4",
                title: "Taxes for Professionals",
                text: "Tax basics include taxable income, slab rates, deductions, and return filing timelines. Salaried and self-employed professionals should keep records of income, eligible deductions, and important documents. Filing returns on time supports compliance and is useful for financial records like loan eligibility. Tax-saving instruments should be selected based on suitability and lock-in implications, not only on tax benefits.",
                focus: ["Tax slabs and returns", "Documentation", "Tax-saving choices"],
                quiz: [
                    { q: "Why should professionals file returns on time?", o: ["No reason", "Compliance and financial records", "To avoid budgeting"], a: 1 },
                    { q: "Tax planning should be based on:", o: ["Suitability and goals", "Only advertising", "Highest lock-in always"], a: 0 },
                    { q: "Core tax basics include:", o: ["Only salary amount", "Slabs deductions filing", "No documentation"], a: 1 }
                ]
            },
            {
                id: "pf-5",
                title: "Insurance Basics",
                text: "Insurance protects your financial plan from large unexpected losses. Life insurance supports dependents if income stops, health insurance prevents medical shocks from breaking savings, and asset insurance protects valuable property. Good planning balances growth and protection. Without insurance, one major event can reverse years of savings progress and force unnecessary debt.",
                focus: ["Life and health cover", "Asset protection", "Risk management"],
                quiz: [
                    { q: "Health insurance helps mainly with:", o: ["Medical cost shocks", "Guaranteed returns", "Trading profits"], a: 0 },
                    { q: "Insurance in planning is for:", o: ["Risk protection", "Speculation", "Tax only"], a: 0 },
                    { q: "Without insurance, a major event can:", o: ["Improve savings immediately", "Damage long-term plans", "Have no impact"], a: 1 }
                ]
            }
        ]
    },
    {
        id: "ti-basic",
        number: 2,
        color: "#60a5fa",
        title: "Traders & Investors - Basic Level",
        description: "Understand financial markets, instruments, platform setup, and technical foundations before active decisions.",
        chapters: [
            {
                id: "ti-1",
                title: "Introduction to Financial Markets",
                text: "Financial markets are systems where participants buy and sell assets such as stocks, bonds, and ETFs. In India, NSE and BSE are the primary stock exchanges. Markets allocate capital, provide liquidity, and allow price discovery. Understanding this structure helps beginners avoid confusion and build correct expectations before entering real transactions.",
                focus: ["NSE and BSE basics", "Market function", "Price discovery"],
                quiz: [
                    { q: "NSE and BSE are:", o: ["Stock exchanges", "Insurance firms", "Tax offices"], a: 0 },
                    { q: "Markets help with:", o: ["Capital allocation", "Guaranteed returns", "No price movement"], a: 0 },
                    { q: "A key market function is:", o: ["Price discovery", "Fixed profit", "No liquidity"], a: 0 }
                ]
            },
            {
                id: "ti-2",
                title: "Investment vs Trading",
                text: "Investing usually targets long-term wealth through business participation and compounding, while trading targets short-term opportunities based on price moves. Both require risk control, but the approach and time horizon differ. Beginners should choose one primary style first and define clear rules for position size, stop-loss, and review process.",
                focus: ["Time horizon difference", "Risk control", "Execution rules"],
                quiz: [
                    { q: "Investing usually focuses on:", o: ["Long-term growth", "Minute charts only", "Daily overtrading"], a: 0 },
                    { q: "Trading generally focuses on:", o: ["Short-term moves", "Only dividend income", "No risk"], a: 0 },
                    { q: "Both investing and trading require:", o: ["No process", "Risk management", "Random execution"], a: 1 }
                ]
            },
            {
                id: "ti-3",
                title: "Basic Financial Instruments",
                text: "Stocks represent ownership, mutual funds provide managed diversification, ETFs combine basket exposure with exchange liquidity, and bonds offer fixed-income characteristics. Understanding each instrument helps you align choices with goal horizon and risk comfort. A balanced beginner approach usually combines growth assets and lower-volatility components.",
                focus: ["Stocks funds ETFs bonds", "Risk alignment", "Balanced allocation"],
                quiz: [
                    { q: "A stock represents:", o: ["Ownership in a company", "Fixed bank deposit", "Insurance claim"], a: 0 },
                    { q: "ETFs are typically:", o: ["Exchange-traded baskets", "Unlisted contracts", "Tax forms"], a: 0 },
                    { q: "Instrument selection should match:", o: ["Goal and risk profile", "Social media tips", "Random picks"], a: 0 }
                ]
            },
            {
                id: "ti-4",
                title: "Brokerage Accounts & Platforms",
                text: "To start trading or investing, complete KYC and open trading plus demat accounts. Learn how to place orders, set watchlists, read order books, and review portfolio holdings. You should also understand brokerage, taxes, and platform charges because cost directly affects net returns.",
                focus: ["KYC and account setup", "Order placement", "Cost awareness"],
                quiz: [
                    { q: "To begin, you typically need:", o: ["Trading and demat account", "Only a social profile", "No KYC"], a: 0 },
                    { q: "Platform costs matter because they:", o: ["Have no impact", "Affect net return", "Replace risk management"], a: 1 },
                    { q: "Order placement knowledge helps:", o: ["Avoid execution mistakes", "Eliminate all risk", "Skip planning"], a: 0 }
                ]
            },
            {
                id: "ti-5",
                title: "Basic Technical Concepts",
                text: "Candlestick charts show open, high, low, and close behavior for each timeframe. Volume helps judge participation, and trend analysis helps avoid trading against momentum. Simple moving averages provide basic structure for entry filters. These tools should support a process, not replace risk control.",
                focus: ["Candlestick reading", "Volume and trend", "Moving averages"],
                quiz: [
                    { q: "Candlesticks represent:", o: ["OHLC price behavior", "Tax slab", "Insurance type"], a: 0 },
                    { q: "Volume helps evaluate:", o: ["Market participation", "Guaranteed return", "No volatility"], a: 0 },
                    { q: "Moving averages are used for:", o: ["Trend structure", "Loan processing", "KYC verification"], a: 0 }
                ]
            }
        ]
    }
];

const state = {
    activeChapterId: null,
    chapterMap: new Map(),
    completed: new Set(JSON.parse(localStorage.getItem("learn2_completed") || "[]"))
};

const el = {
    modulesGrid: document.getElementById("learn2-modules-grid"),
    chaptersRoot: document.getElementById("learn2-chapters-root"),
    topicCount: document.getElementById("learn2-topic-count"),
    kicker: document.getElementById("learn2-kicker"),
    title: document.getElementById("learn2-chapter-title"),
    desc: document.getElementById("learn2-chapter-desc"),
    focus: document.getElementById("learn2-focus"),
    videoTitle: document.getElementById("learn2-video-title"),
    status: document.getElementById("learn2-status"),
    openQuizBtn: document.getElementById("learn2-open-quiz"),
    quizModal: document.getElementById("learn2-quiz-modal"),
    quizForm: document.getElementById("learn2-quiz-form"),
    quizSubtitle: document.getElementById("learn2-quiz-subtitle"),
    quizResult: document.getElementById("learn2-quiz-result"),
    submitQuizBtn: document.getElementById("learn2-submit-quiz")
};

function saveCompleted() {
    localStorage.setItem("learn2_completed", JSON.stringify(Array.from(state.completed)));
}

function renderModuleCards() {
    el.modulesGrid.innerHTML = learningBasicModules.map((m) => `
        <article class="learn2-module-card" style="--line:${m.color}">
            <p class="learn2-module-number">${m.number}</p>
            <h3>${m.title}</h3>
            <p class="learn2-module-chapters">${m.chapters.length} chapters</p>
            <p class="learn2-module-desc">${m.description}</p>
            <button type="button" class="learn2-go" data-go-module="${m.id}">View chapters</button>
        </article>
    `).join("");
}

function renderChapterLists() {
    el.chaptersRoot.innerHTML = learningBasicModules.map((m) => `
        <section class="learn2-chapter-group" id="group-${m.id}">
            <div class="learn2-group-head" style="--line:${m.color}">
                <h3>${m.title}</h3>
                <p>${m.chapters.length} chapters</p>
            </div>
            <div class="learn2-chapter-list">
                ${m.chapters.map((c, idx) => `
                    <article class="learn2-chapter-item" id="item-${c.id}">
                        <div>
                            <h4>${idx + 1}. ${c.title}</h4>
                            <p>${c.text.slice(0, 180)}...</p>
                        </div>
                        <div class="learn2-chapter-actions">
                            <button type="button" class="btn secondary" data-open-chapter="${c.id}">Open lesson</button>
                            <span class="learn2-done ${state.completed.has(c.id) ? "done" : ""}" id="done-${c.id}">
                                ${state.completed.has(c.id) ? "Quiz passed" : "Quiz pending"}
                            </span>
                        </div>
                    </article>
                `).join("")}
            </div>
        </section>
    `).join("");
}

function openChapter(chapterId) {
    const chapter = state.chapterMap.get(chapterId);
    if (!chapter) return;

    state.activeChapterId = chapterId;
    el.kicker.textContent = chapter.moduleTitle;
    el.title.textContent = chapter.title;
    el.desc.textContent = chapter.text;
    el.videoTitle.textContent = chapter.title;
    el.focus.innerHTML = chapter.focus.map((f) => `<span>${f}</span>`).join("");
    el.openQuizBtn.disabled = false;
    const passed = state.completed.has(chapterId);
    el.status.textContent = passed ? "Quiz passed" : "Quiz pending";
    el.status.className = `learn2-status ${passed ? "pass" : "pending"}`;

    document.querySelectorAll(".learn2-chapter-item").forEach((n) => n.classList.remove("active"));
    const activeEl = document.getElementById(`item-${chapterId}`);
    if (activeEl) activeEl.classList.add("active");
    document.getElementById("learn2-viewer").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openQuiz() {
    const chapter = state.chapterMap.get(state.activeChapterId);
    if (!chapter) return;

    el.quizSubtitle.textContent = chapter.title;
    el.quizResult.textContent = "";
    el.quizResult.className = "learn2-quiz-result";
    el.quizForm.innerHTML = chapter.quiz.map((q, qi) => `
        <fieldset>
            <legend>${qi + 1}. ${q.q}</legend>
            ${q.o.map((opt, oi) => `
                <label>
                    <input type="radio" name="q${qi}" value="${oi}" />
                    <span>${opt}</span>
                </label>
            `).join("")}
        </fieldset>
    `).join("");
    el.quizModal.hidden = false;
}

function closeQuiz() {
    el.quizModal.hidden = true;
}

function submitQuiz() {
    const chapter = state.chapterMap.get(state.activeChapterId);
    if (!chapter) return;

    let score = 0;
    let answered = 0;

    chapter.quiz.forEach((q, qi) => {
        const selected = el.quizForm.querySelector(`input[name="q${qi}"]:checked`);
        if (!selected) return;
        answered += 1;
        if (Number(selected.value) === q.a) score += 1;
    });

    if (answered < chapter.quiz.length) {
        el.quizResult.textContent = "Please answer all questions.";
        el.quizResult.className = "learn2-quiz-result fail";
        return;
    }

    const pass = score >= 2;
    el.quizResult.textContent = pass
        ? `Passed: ${score}/${chapter.quiz.length}. Chapter marked complete.`
        : `Score: ${score}/${chapter.quiz.length}. Minimum 2 correct required.`;
    el.quizResult.className = `learn2-quiz-result ${pass ? "pass" : "fail"}`;

    if (!pass) return;

    state.completed.add(chapter.id);
    saveCompleted();
    const doneEl = document.getElementById(`done-${chapter.id}`);
    if (doneEl) {
        doneEl.classList.add("done");
        doneEl.textContent = "Quiz passed";
    }
    el.status.textContent = "Quiz passed";
    el.status.className = "learn2-status pass";
}

function bindEvents() {
    el.modulesGrid.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-go-module]");
        if (!btn) return;
        const group = document.getElementById(`group-${btn.dataset.goModule}`);
        if (group) group.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    el.chaptersRoot.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-open-chapter]");
        if (!btn) return;
        openChapter(btn.dataset.openChapter);
    });

    el.openQuizBtn.addEventListener("click", openQuiz);
    el.submitQuizBtn.addEventListener("click", submitQuiz);

    document.addEventListener("click", (e) => {
        const close = e.target.closest("[data-close-quiz]");
        if (close) closeQuiz();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !el.quizModal.hidden) closeQuiz();
    });
}

function init() {
    let total = 0;
    learningBasicModules.forEach((module) => {
        module.chapters.forEach((chapter) => {
            state.chapterMap.set(chapter.id, { ...chapter, moduleTitle: module.title });
            total += 1;
        });
    });
    el.topicCount.textContent = String(total);

    renderModuleCards();
    renderChapterLists();
    bindEvents();

    const firstChapter = learningBasicModules[0]?.chapters[0];
    if (firstChapter) openChapter(firstChapter.id);
}

document.addEventListener("DOMContentLoaded", init);
