const advancedChapters = [
    {
        id: "a1",
        title: "1. Advanced Investment Strategies",
        brief: "Diversification, asset allocation, and advanced instruments.",
        theory: [
            "Advanced investment strategy is about constructing systems, not chasing isolated opportunities. At this stage, the goal shifts from just earning returns to building a risk-adjusted portfolio that survives different market environments.",
            "Diversification reduces concentration risk by spreading capital across asset classes, sectors, geographies, and investment styles. It does not eliminate risk, but it improves resilience when one segment underperforms.",
            "Asset allocation is the primary return-risk driver over long horizons. Equity, debt, gold, global exposure, and alternatives should be assigned based on objective, duration, and drawdown tolerance.",
            "Real-world scenario: two investors both target long-term growth. One keeps 80% in one thematic sector and experiences deep drawdowns during cycle reversal. The other uses diversified allocation across equity styles, debt, and gold, resulting in smoother outcomes and better behavioral stability.",
            "Application step: define strategic allocation bands and rebalance periodically. Advanced investing is less about frequent predictions and more about controlled allocation, disciplined rebalancing, and risk governance."
        ],
        bestPractices: [
            "Set strategic allocation ranges for each asset class.",
            "Review concentration risk at portfolio and sector levels.",
            "Rebalance periodically instead of reacting emotionally.",
            "Use advanced instruments only with clear purpose.",
            "Track portfolio risk-adjusted return, not only absolute return."
        ]
    },
    {
        id: "a2",
        title: "2. Advanced Tax Planning",
        brief: "Tax optimization using deductions, exemptions, and gain strategy.",
        theory: [
            "Advanced tax planning integrates investment, business income, and capital gain treatment into a unified strategy. The objective is to improve post-tax outcomes while remaining fully compliant.",
            "Tax optimization includes planning holding periods, structuring withdrawals, and sequencing redemptions intelligently. Different assets have different tax treatment, so transaction timing can significantly affect final net return.",
            "Deductions and exemptions should be mapped to yearly cash flow and portfolio actions. Advanced planning also considers how multiple income streams interact during tax computation.",
            "Real-world scenario: an investor redeems multiple assets in one year without tax sequencing, triggering avoidable liability. Another investor uses staged redemptions and holding-period awareness, reducing tax drag while meeting cash requirements.",
            "Application step: maintain a tax-impact dashboard before major portfolio actions. This helps compare alternatives on post-tax basis and avoid surprises during filing season."
        ],
        bestPractices: [
            "Evaluate every large redemption on post-tax impact.",
            "Use holding-period discipline in tax-sensitive assets.",
            "Coordinate deductions, exemptions, and gains strategically.",
            "Plan withdrawals in tranches where practical.",
            "Review annual tax position before year-end execution."
        ]
    },
    {
        id: "a3",
        title: "3. Financial Tools & Calculators",
        brief: "Retirement, SIP, EMI, and inflation-adjusted planning tools.",
        theory: [
            "Advanced planning requires quantification. Financial calculators convert assumptions into actionable numbers and improve decision quality across goals, liabilities, and wealth planning.",
            "Retirement tools estimate required corpus based on inflation-adjusted expenses, growth assumptions, and withdrawal years. SIP tools estimate accumulation pathways under varying contribution and return scenarios.",
            "EMI and loan calculators support liability management by showing total cost and tenure trade-offs. Inflation tools help in converting nominal targets into realistic future-value needs.",
            "Real-world scenario: a household plans education funding using today's cost and underestimates requirement by a wide margin. With inflation-adjusted tools, they revise the target and build a more realistic contribution schedule.",
            "Application step: build a quarterly decision dashboard combining SIP projection, debt profile, emergency corpus status, and retirement glide path. Tools should support decisions, not replace judgment."
        ],
        bestPractices: [
            "Use inflation-adjusted inputs for long-term goals.",
            "Stress-test assumptions with conservative and optimistic cases.",
            "Track both investment growth and liability burden.",
            "Update calculator inputs after major life or income changes.",
            "Use tool outputs as guidance with practical judgment."
        ]
    },
    {
        id: "a4",
        title: "4. Estate & Risk Management",
        brief: "Wills, trusts, legacy planning, and insurance optimization.",
        theory: [
            "Estate and risk management ensures that wealth transitions smoothly and efficiently to intended beneficiaries. Without planning, legal delays and disputes can reduce financial value and create family stress.",
            "Core elements include will creation, nominee alignment, record clarity, and where needed, trust structures for specific objectives. Insurance optimization also plays a role in preserving estate value and liquidity during transitions.",
            "Advanced risk management checks whether current coverage still matches liability, family dependency, and business obligations. Over-insurance or under-insurance both create inefficiencies.",
            "Real-world scenario: a high-value portfolio without updated nominee and will documentation remains locked in prolonged administrative process, delaying access for dependents. A well-structured estate plan significantly reduces friction.",
            "Application step: maintain a yearly estate review checklist covering will updates, nominee consistency, policy adequacy, and document accessibility for trusted family members."
        ],
        bestPractices: [
            "Create and periodically update a legally valid will.",
            "Keep nominee details consistent across all accounts.",
            "Review insurance coverage as liabilities change.",
            "Organize critical documents in an accessible format.",
            "Reassess estate structure after major family events."
        ]
    },
    {
        id: "a5",
        title: "5. Behavioral Finance & Decision Making",
        brief: "Bias control, emotional discipline, and decision frameworks.",
        theory: [
            "Behavioral finance explains why intelligent investors still make costly mistakes. Biases such as overconfidence, herd behavior, anchoring, and loss aversion can distort judgment even when data is available.",
            "Fear and greed cycles often trigger poor timing decisions: buying aggressively in euphoria and selling in panic. Advanced investors use process discipline to reduce these behavior-driven errors.",
            "Decision frameworks improve quality under uncertainty. Predefined rules for entry, allocation, review, and exit reduce reactive actions and maintain consistency across cycles.",
            "Real-world scenario: an investor exits diversified holdings during short-term market panic and misses recovery. Another investor follows predefined rebalancing rules and gradually adds to quality allocation, improving long-term outcome.",
            "Application step: maintain an investment journal with decision rationale, expected risk, and review checkpoints. This creates accountability and helps identify recurring behavioral mistakes."
        ],
        bestPractices: [
            "Use written rules for allocation and rebalancing.",
            "Avoid action based solely on crowd sentiment.",
            "Separate market noise from goal-based decisions.",
            "Track behavioral mistakes in an investment journal.",
            "Review process quality, not just return outcome."
        ]
    }
];

const advancedQuizBank = {
    a1: [
        {
            id: "q1",
            question: "Main objective of diversification is to:",
            options: [
                "Maximize exposure to one best-performing sector",
                "Reduce concentration risk across assets and styles",
                "Guarantee profit in every period",
                "Avoid all volatility permanently"
            ],
            answer: 1,
            explanation: "Diversification improves resilience by reducing dependency on a single segment."
        },
        {
            id: "q2",
            question: "Asset allocation matters because it:",
            options: [
                "Has limited impact on portfolio behavior",
                "Is a major long-term risk-return driver",
                "Removes need for rebalancing",
                "Is relevant only for institutions"
            ],
            answer: 1,
            explanation: "Allocation decisions usually shape most long-term portfolio outcomes."
        },
        {
            id: "q3",
            question: "A practical advanced investing habit is:",
            options: [
                "Frequent thematic concentration bets",
                "Periodic rule-based rebalancing",
                "No risk monitoring",
                "Ignoring drawdown tolerance"
            ],
            answer: 1,
            explanation: "Rebalancing helps retain intended risk profile."
        },
        {
            id: "q4",
            question: "Advanced instruments should be used:",
            options: [
                "For excitement only",
                "With clear strategy purpose and risk understanding",
                "Without position limits",
                "As replacement for all core assets"
            ],
            answer: 1,
            explanation: "Complex tools need defined purpose and disciplined controls."
        }
    ],
    a2: [
        {
            id: "q1",
            question: "Advanced tax planning focuses primarily on:",
            options: [
                "Ignoring compliance for higher return",
                "Improving post-tax outcomes compliantly",
                "Only pre-tax returns",
                "One-time year-end action only"
            ],
            answer: 1,
            explanation: "Tax strategy should improve net return while staying compliant."
        },
        {
            id: "q2",
            question: "Why is redemption sequencing important?",
            options: [
                "It has no effect on tax liability",
                "It can change final tax outcome significantly",
                "It guarantees zero tax",
                "It replaces investment strategy"
            ],
            answer: 1,
            explanation: "Transaction timing and holding period can materially alter tax impact."
        },
        {
            id: "q3",
            question: "Best practice before large portfolio actions:",
            options: [
                "No analysis required",
                "Check post-tax alternatives and cash-flow effect",
                "Use only headline returns",
                "Delay all tax planning to filing week"
            ],
            answer: 1,
            explanation: "Pre-action tax review avoids avoidable drag and surprises."
        },
        {
            id: "q4",
            question: "Tax optimization should be:",
            options: [
                "Detached from portfolio and cash flow",
                "Integrated with broader financial plan",
                "Based only on product marketing",
                "Independent of holding period"
            ],
            answer: 1,
            explanation: "Integrated planning improves consistency and efficiency."
        }
    ],
    a3: [
        {
            id: "q1",
            question: "Financial calculators are most useful when they:",
            options: [
                "Replace all judgment",
                "Convert assumptions into measurable planning outputs",
                "Are used once and never updated",
                "Ignore inflation"
            ],
            answer: 1,
            explanation: "Tools support structured analysis but still require practical judgment."
        },
        {
            id: "q2",
            question: "Which input is essential for long-term goal planning?",
            options: [
                "Current value only",
                "Inflation-adjusted future cost assumptions",
                "No time horizon",
                "Random return estimate"
            ],
            answer: 1,
            explanation: "Inflation-adjusted targets prevent underestimation of future needs."
        },
        {
            id: "q3",
            question: "A strong planning dashboard should include:",
            options: [
                "Only investment return",
                "Only EMI burden",
                "Goals, liabilities, emergency status, and retirement path",
                "No periodic review"
            ],
            answer: 2,
            explanation: "Balanced dashboards align growth, protection, and obligations."
        },
        {
            id: "q4",
            question: "Quarterly updates to tool inputs are useful because:",
            options: [
                "Life and income conditions change",
                "Tools never need revision",
                "Assumptions are permanently fixed",
                "Review reduces clarity"
            ],
            answer: 0,
            explanation: "Updated inputs keep decisions relevant and actionable."
        }
    ],
    a4: [
        {
            id: "q1",
            question: "Estate planning primarily helps in:",
            options: [
                "Increasing market timing accuracy",
                "Smooth wealth transfer and reduced friction for dependents",
                "Avoiding all taxes always",
                "Replacing insurance"
            ],
            answer: 1,
            explanation: "Estate planning protects continuity and reduces legal/administrative delays."
        },
        {
            id: "q2",
            question: "A critical operational step is:",
            options: [
                "Ignoring nominee records",
                "Aligning nominees and legal documents across accounts",
                "Keeping records inaccessible",
                "Never updating will after life events"
            ],
            answer: 1,
            explanation: "Consistency across documentation prevents execution conflicts."
        },
        {
            id: "q3",
            question: "Insurance optimization in estate planning means:",
            options: [
                "Maximizing premiums irrespective of need",
                "Matching coverage to liabilities and dependents",
                "Using insurance as primary high-return tool",
                "Avoiding policy review"
            ],
            answer: 1,
            explanation: "Right-sized coverage supports protection without inefficiency."
        },
        {
            id: "q4",
            question: "Best annual estate practice:",
            options: [
                "Do nothing once documents are signed",
                "Run checklist for will, nominees, policies, and access",
                "Share no information with family",
                "Skip review after major events"
            ],
            answer: 1,
            explanation: "Annual review keeps plan aligned with evolving life context."
        }
    ],
    a5: [
        {
            id: "q1",
            question: "Behavioral finance studies:",
            options: [
                "Only corporate law",
                "How biases affect money decisions",
                "How to eliminate uncertainty completely",
                "Only accounting standards"
            ],
            answer: 1,
            explanation: "Investor behavior and bias strongly influence outcomes."
        },
        {
            id: "q2",
            question: "A practical way to reduce emotional mistakes is:",
            options: [
                "Follow market noise continuously",
                "Use predefined decision rules and journaling",
                "Change strategy every week",
                "Ignore review checkpoints"
            ],
            answer: 1,
            explanation: "Structured rules reduce panic and overconfidence decisions."
        },
        {
            id: "q3",
            question: "Panic selling usually reflects:",
            options: [
                "Perfect long-term discipline",
                "Fear-driven short-term reaction",
                "Tax optimization strategy",
                "Portfolio diversification rule"
            ],
            answer: 1,
            explanation: "Fear during volatility often causes premature exits."
        },
        {
            id: "q4",
            question: "An investment journal is useful because it:",
            options: [
                "Adds complexity without value",
                "Creates accountability and pattern recognition",
                "Guarantees returns",
                "Replaces risk management"
            ],
            answer: 1,
            explanation: "Documenting rationale helps identify repeating decision errors."
        }
    ]
};

const topicGrid = document.getElementById("learn3-topic-grid");
const kicker = document.getElementById("learn3-kicker");
const theoryTitle = document.getElementById("learn3-theory-title");
const theoryBody = document.getElementById("learn3-theory-body");
const bestList = document.getElementById("learn3-best-practices");
const videoFrame = document.querySelector(".learn3-video-frame");
const quizTitle = document.getElementById("learn3-quiz-title");
const quizMeta = document.getElementById("learn3-quiz-meta");
const quizForm = document.getElementById("learn3-quiz-form");
const quizSubmit = document.getElementById("learn3-submit-quiz");
const quizResult = document.getElementById("learn3-quiz-result");
const progressPercent = document.getElementById("learn3-progress-percent");
const progressFill = document.getElementById("learn3-progress-fill");
const progressText = document.getElementById("learn3-progress-text");
const keyTakeawaysList = document.getElementById("learn3-key-takeaways");
const financialTipText = document.getElementById("learn3-financial-tip");
const exampleText = document.getElementById("learn3-example-text");
const prevChapterBtn = document.getElementById("learn3-prev-chapter");
const nextChapterBtn = document.getElementById("learn3-next-chapter");
const relatedToolsList = document.getElementById("learn3-related-tools-list");

const LEARN3A_PROGRESS_KEY = "learn3_advanced_completed";
const completedChapters = new Set(JSON.parse(localStorage.getItem(LEARN3A_PROGRESS_KEY) || "[]"));

const chapterMeta = {
    a1: { readTime: 11, difficulty: "Advanced" },
    a2: { readTime: 10, difficulty: "Advanced" },
    a3: { readTime: 9, difficulty: "Advanced" },
    a4: { readTime: 10, difficulty: "Advanced" },
    a5: { readTime: 9, difficulty: "Advanced" }
};

const lessonVideos = {
    advanced: {
        a1: "SrwvmO3za3Q",
        a2: "Ku0uHMWmStc",
        a3: "6rDz1uto0lw",
        a4: "jfaABy0E6r4",
        a5: "_r3ga0u-Mis"
    }
};

function buildYoutubeEmbedUrl(videoId) {
    const params = new URLSearchParams({
        autoplay: "0",
        controls: "0",
        rel: "0",
        modestbranding: "1",
        playsinline: "1",
        iv_load_policy: "3",
        showinfo: "0",
        disablekb: "1",
        fs: "0",
        enablejsapi: "1",
        origin: window.location.origin
    });

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

function sendYoutubeCommand(iframe, command) {
    if (!iframe?.contentWindow) return;

    iframe.contentWindow.postMessage(JSON.stringify({
        event: "command",
        func: command,
        args: []
    }), "*");
}

const chapterLearningSections = {
    a1: {
        keyTakeaways: [
            "Diversification improves portfolio resilience.",
            "Asset allocation is a primary risk-return driver.",
            "Rebalancing supports long-term discipline."
        ],
        financialTip: "Use allocation bands so rebalancing decisions stay rule-based, not emotional.",
        example: "If equity rises beyond target weight, partial rebalance can restore intended portfolio risk."
    },
    a2: {
        keyTakeaways: [
            "Tax-aware sequencing improves net outcomes.",
            "Holding period impacts realized tax.",
            "Tax strategy should align with cash-flow needs."
        ],
        financialTip: "Compare redemption options on post-tax basis before final execution.",
        example: "Staggered redemptions can reduce tax drag compared with unplanned lump-sum exits."
    },
    a3: {
        keyTakeaways: [
            "Tools convert assumptions into decision-ready metrics.",
            "Inflation-adjusted planning prevents target underestimation.",
            "Quarterly updates keep projections realistic."
        ],
        financialTip: "Run conservative and optimistic scenarios before committing to long-term plans.",
        example: "A retirement corpus estimate changes significantly when inflation assumption shifts from 5% to 7%."
    },
    a4: {
        keyTakeaways: [
            "Estate planning protects wealth transfer continuity.",
            "Nominee alignment prevents legal friction.",
            "Coverage should be reviewed as liabilities evolve."
        ],
        financialTip: "Review will and nominee data annually and after major family events.",
        example: "Updating nominee records across all accounts can avoid delays during claim settlement."
    },
    a5: {
        keyTakeaways: [
            "Behavioral bias can hurt returns despite good analysis.",
            "Written rules reduce fear/greed decisions.",
            "Journaling improves decision accountability."
        ],
        financialTip: "Define entry, exit, and review rules before market volatility tests your discipline.",
        example: "Investors using rebalancing rules often avoid panic-selling during temporary corrections."
    }
};

const chapterRelatedTools = {
    a1: [
        { label: "Goal Planner Calculator", href: "/pages/tools.html#popular-tools-title" },
        { label: "ROI Calculator", href: "/pages/tools.html#investment-tools-title" }
    ],
    a2: [
        { label: "Income Tax Calculator", href: "/pages/tools.html#tax-tools-title" },
        { label: "Capital Gains Calculator", href: "/pages/tools.html#tax-tools-title" }
    ],
    a3: [
        { label: "SIP Calculator", href: "/pages/tools.html#popular-tools-title" },
        { label: "EMI Calculator", href: "/pages/tools.html#loan-tools-title" },
        { label: "Inflation Calculator", href: "/pages/tools.html#planning-tools-title" }
    ],
    a4: [
        { label: "Retirement Calculator", href: "/pages/tools.html#popular-tools-title" },
        { label: "Net Worth Calculator", href: "/pages/tools.html#planning-tools-title" }
    ],
    a5: [
        { label: "CAGR Calculator", href: "/pages/tools.html#investment-tools-title" },
        { label: "ROI Calculator", href: "/pages/tools.html#investment-tools-title" }
    ]
};

function renderLessonVideo(chapter) {
    if (!videoFrame || !chapter) return;

    const cleanTitle = chapter.title.replace(/^\d+\.\s*/, "");
    const videoId = lessonVideos.advanced[chapter.id];

    if (!videoId) {
        videoFrame.innerHTML = `<p id="learn3-video-label">Lesson Video: ${cleanTitle}</p>`;
        return;
    }

    videoFrame.innerHTML = `
        <p>Loading lesson video...</p>
        <p id="learn3-video-label">Lesson Video: ${cleanTitle}</p>
    `;

    const loadingText = videoFrame.querySelector("p");
    const label = videoFrame.querySelector("#learn3-video-label");
    let isPlaying = false;

    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "315";
    iframe.src = buildYoutubeEmbedUrl(videoId);
    iframe.title = `Lesson Video: ${cleanTitle}`;
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.setAttribute("allowfullscreen", "");
    iframe.style.display = "none";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "learn3-video-toggle";
    toggleButton.setAttribute("aria-label", "Play video");
    toggleButton.dataset.state = "play";
    toggleButton.disabled = true;

    toggleButton.addEventListener("click", () => {
        if (isPlaying) {
            sendYoutubeCommand(iframe, "pauseVideo");
            toggleButton.dataset.state = "play";
            toggleButton.setAttribute("aria-label", "Play video");
            isPlaying = false;
            return;
        }

        sendYoutubeCommand(iframe, "playVideo");
        toggleButton.dataset.state = "pause";
        toggleButton.setAttribute("aria-label", "Pause video");
        isPlaying = true;
    });

    iframe.addEventListener("load", () => {
        if (loadingText) {
            loadingText.remove();
        }
        iframe.style.display = "block";
        toggleButton.dataset.state = "play";
        toggleButton.setAttribute("aria-label", "Play video");
        toggleButton.disabled = false;
    });

    if (label) {
        videoFrame.insertBefore(iframe, label);
        videoFrame.insertBefore(toggleButton, label);
    } else {
        videoFrame.appendChild(iframe);
        videoFrame.appendChild(toggleButton);
    }
}

function saveProgress() {
    localStorage.setItem(LEARN3A_PROGRESS_KEY, JSON.stringify(Array.from(completedChapters)));
}

function updateProgressUI() {
    const totalChapters = advancedChapters.length;
    const completedCount = advancedChapters.filter((chapter) => completedChapters.has(chapter.id)).length;
    const percent = totalChapters ? Math.round((completedCount / totalChapters) * 100) : 0;

    if (progressPercent) {
        progressPercent.textContent = `${percent}%`;
    }

    if (progressFill) {
        progressFill.style.width = `${percent}%`;
        const track = progressFill.closest(".learn3-progress-track");
        if (track) track.setAttribute("aria-valuenow", String(percent));
    }

    if (progressText) {
        progressText.textContent = `${completedCount} of ${totalChapters} Chapters Completed`;
    }
}

function markChapterCompleted(chapterId) {
    if (!chapterId || completedChapters.has(chapterId)) return;

    completedChapters.add(chapterId);
    saveProgress();
    updateProgressUI();

    const card = topicGrid?.querySelector(`[data-topic-id="${chapterId}"]`);
    if (card) {
        card.classList.add("is-complete");
        const status = card.querySelector(".learn3-topic-status");
        if (status) {
            status.textContent = "✔ Completed";
            status.className = "learn3-topic-status done";
        }
    }
}

function renderTopics() {
    topicGrid.innerHTML = advancedChapters
        .map((chapter) => {
            const isCompleted = completedChapters.has(chapter.id);
            const metadata = chapterMeta[chapter.id] || { readTime: 10, difficulty: "Advanced" };
            return `
            <article class="learn3-topic-card ${isCompleted ? "is-complete" : ""}" data-topic-id="${chapter.id}">
                <h4>${chapter.title}</h4>
                <p class="learn3-topic-meta">
                    <span class="learn3-read-time">⏱ ${metadata.readTime} min read</span>
                    <span aria-hidden="true">•</span>
                    <span class="learn3-difficulty">${metadata.difficulty}</span>
                </p>
                <p>${chapter.brief}</p>
                <p class="learn3-topic-status ${isCompleted ? "done" : "pending"}">
                    ${isCompleted ? "✔ Completed" : "○ Not completed"}
                </p>
                <button type="button" class="btn secondary">Open Chapter</button>
            </article>
        `;
        })
        .join("");

    updateProgressUI();
}

function renderQuizForChapter(chapter) {
    const questions = advancedQuizBank[chapter.id] || [];
    const cleanTitle = chapter.title.replace(/^\d+\.\s*/, "");

    quizForm.dataset.chapterId = chapter.id;
    quizResult.textContent = "";
    quizResult.className = "learn3-quiz-result";
    quizTitle.textContent = `Chapter Quiz: ${cleanTitle}`;
    quizMeta.textContent = `${questions.length} questions • scenario-based checks`;

    quizForm.innerHTML = questions
        .map((item, idx) => `
            <fieldset class="learn3-quiz-item" data-question-id="${item.id}">
                <legend>${idx + 1}. ${item.question}</legend>
                ${item.options.map((option, optIdx) => `
                    <label data-option-index="${optIdx}">
                        <input type="radio" name="${item.id}" value="${optIdx}" />
                        <span>${option}</span>
                    </label>
                `).join("")}
                <p class="learn3-quiz-feedback" id="feedback-${item.id}" aria-live="polite"></p>
                <p class="learn3-quiz-explain">${item.explanation}</p>
            </fieldset>
        `)
        .join("");

    quizSubmit.disabled = questions.length === 0;
}

function updateOptionSelectionStyles(questionName) {
    const questionInputs = quizForm.querySelectorAll(`input[name="${questionName}"]`);
    const labels = Array.from(questionInputs).map((input) => input.closest("label")).filter(Boolean);
    labels.forEach((label) => {
        const input = label.querySelector("input");
        label.classList.toggle("is-selected", Boolean(input?.checked));
    });
}

function scoreActiveQuiz() {
    const chapterId = quizForm.dataset.chapterId;
    const questions = advancedQuizBank[chapterId] || [];
    let score = 0;
    let answered = 0;

    questions.forEach((item) => {
        const fieldset = quizForm.querySelector(`[data-question-id="${item.id}"]`);
        const selected = quizForm.querySelector(`input[name="${item.id}"]:checked`);
        const allLabels = fieldset?.querySelectorAll("label") || [];
        const feedback = fieldset?.querySelector(".learn3-quiz-feedback");

        allLabels.forEach((label) => {
            label.classList.remove("is-correct", "is-wrong");
            const optIndex = Number(label.dataset.optionIndex);
            if (optIndex === item.answer) label.classList.add("is-correct");
        });

        if (selected) {
            answered += 1;
            if (Number(selected.value) === item.answer) {
                score += 1;
                if (feedback) {
                    feedback.textContent = "Correct!";
                    feedback.className = "learn3-quiz-feedback pass";
                }
            } else {
                selected.closest("label")?.classList.add("is-wrong");
                if (feedback) {
                    feedback.textContent = "Incorrect.";
                    feedback.className = "learn3-quiz-feedback fail";
                }
            }
        } else if (feedback) {
            feedback.textContent = "Not answered.";
            feedback.className = "learn3-quiz-feedback fail";
        }

        fieldset?.classList.add("is-evaluated");
    });

    if (answered !== questions.length) {
        quizResult.textContent = "Please answer all quiz questions before checking.";
        quizResult.className = "learn3-quiz-result fail";
        return;
    }

    const passMark = Math.ceil(questions.length * 0.75);
    const isPass = score >= passMark;
    quizResult.textContent = `Quiz Result: ${score} / ${questions.length} Correct. ${isPass ? "Strong understanding. Continue to next chapter." : "Review explanations and retry for stronger clarity."}`;
    quizResult.className = `learn3-quiz-result ${isPass ? "pass" : "fail"}`;

    if (isPass) {
        markChapterCompleted(chapterId);
    }
}

function renderRelatedTools(chapterId) {
    if (!relatedToolsList) return;
    const tools = chapterRelatedTools[chapterId] || [];

    relatedToolsList.innerHTML = tools
        .map((tool) => `
            <a class="learn3-related-tool-chip" href="${tool.href}">${tool.label}</a>
        `)
        .join("");
}

function updateLessonNavigation(chapterId) {
    const activeIndex = advancedChapters.findIndex((chapter) => chapter.id === chapterId);
    if (activeIndex === -1) return;

    if (prevChapterBtn) {
        prevChapterBtn.disabled = activeIndex === 0;
        prevChapterBtn.dataset.targetId = advancedChapters[activeIndex - 1]?.id || "";
    }

    if (nextChapterBtn) {
        nextChapterBtn.disabled = activeIndex === advancedChapters.length - 1;
        nextChapterBtn.dataset.targetId = advancedChapters[activeIndex + 1]?.id || "";
    }
}

function goToAdjacentChapter(direction) {
    const chapterId = direction < 0
        ? prevChapterBtn?.dataset.targetId
        : nextChapterBtn?.dataset.targetId;
    if (!chapterId) return;
    setActiveTopic(chapterId);
    document.getElementById("learn3-theory").scrollIntoView({ behavior: "smooth", block: "start" });
}

function setActiveTopic(chapterId) {
    const chapter = advancedChapters.find((item) => item.id === chapterId);
    if (!chapter) return;

    document.querySelectorAll(".learn3-topic-card").forEach((card) => {
        card.classList.toggle("active", card.dataset.topicId === chapterId);
    });

    kicker.textContent = "Advanced Level";
    theoryTitle.textContent = chapter.title.replace(/^\d+\.\s*/, "");
    theoryBody.innerHTML = chapter.theory.map((paragraph) => `<p>${paragraph}</p>`).join("");
    const sections = chapterLearningSections[chapter.id];
    if (keyTakeawaysList) {
        keyTakeawaysList.innerHTML = (sections?.keyTakeaways || []).map((point) => `<li>${point}</li>`).join("");
    }
    if (financialTipText) {
        financialTipText.textContent = sections?.financialTip || "Build consistency first, then optimize strategy.";
    }
    if (exampleText) {
        exampleText.textContent = sections?.example || "Use realistic numbers from your monthly cash flow before deciding.";
    }
    bestList.innerHTML = chapter.bestPractices.map((item) => `<li>${item}</li>`).join("");
    renderRelatedTools(chapter.id);
    updateLessonNavigation(chapter.id);
    renderLessonVideo(chapter);
    renderQuizForChapter(chapter);
}

document.addEventListener("DOMContentLoaded", () => {
    renderTopics();
    setActiveTopic("a1");

    topicGrid.addEventListener("click", (event) => {
        const card = event.target.closest("[data-topic-id]");
        if (!card) return;
        setActiveTopic(card.dataset.topicId);
        document.getElementById("learn3-theory").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    quizForm.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.type !== "radio") return;
        updateOptionSelectionStyles(target.name);
        quizResult.textContent = "";
        quizResult.className = "learn3-quiz-result";
    });

    quizSubmit.addEventListener("click", scoreActiveQuiz);
    prevChapterBtn?.addEventListener("click", () => goToAdjacentChapter(-1));
    nextChapterBtn?.addEventListener("click", () => goToAdjacentChapter(1));
});
