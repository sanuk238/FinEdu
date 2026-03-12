const intermediateChapters = [
    {
        id: "i1",
        title: "1. Investment Fundamentals",
        brief: "Saving vs investing, risk-return relation, and inflation impact.",
        theory: [
            "Investment fundamentals begin with one critical distinction: saving protects capital for short-term certainty, while investing deploys capital for long-term growth with measured risk. Savings accounts and fixed deposits support liquidity and safety, but long-term wealth creation usually requires investments that can outpace inflation.",
            "Risk and return are linked. Assets with lower volatility often offer lower expected return, while higher-growth assets can fluctuate more in the short term. The practical goal is not to remove risk entirely, but to choose the right risk level for your time horizon, cash-flow needs, and psychological comfort.",
            "Inflation silently reduces purchasing power. If your money grows at 5% but inflation runs at 6%, your real wealth effectively declines. This is why long-term planning must compare returns after inflation rather than looking only at nominal gains.",
            "Real-world scenario: two professionals save INR 15,000 per month for 10 years. One keeps all money in low-yield savings, the other uses a diversified allocation of debt and equity based on risk profile. The second is more likely to preserve and grow real purchasing power over time.",
            "Application step: define financial goals by timeline. Keep emergency money in low-risk instruments, medium-term goals in balanced allocation, and long-term goals in growth-oriented assets. This goal-based mapping converts investment from guesswork into structured decision making."
        ],
        bestPractices: [
            "Separate short-term safety money from long-term investment money.",
            "Measure returns in real terms after inflation.",
            "Choose risk level based on horizon, not market noise.",
            "Review allocation at least once every six months.",
            "Avoid investing without a written goal timeline."
        ]
    },
    {
        id: "i2",
        title: "2. Mutual Funds & SIPs",
        brief: "Mutual fund types, SIP logic, and practical accumulation framework.",
        theory: [
            "Mutual funds pool money from multiple investors and deploy it according to a stated objective. Categories such as equity, debt, and hybrid funds differ in volatility, expected return behavior, and suitability for different goals.",
            "SIP (Systematic Investment Plan) enables periodic investing and reduces timing pressure. Instead of waiting for a perfect entry point, SIP creates discipline and spreads purchases across market cycles.",
            "SIP calculation should include contribution amount, expected return, and time horizon. Small monthly contributions can become meaningful over long periods because of compounding. Consistency generally contributes more than occasional large deposits.",
            "Real-world scenario: an investor starts SIP with INR 5,000 monthly and increases contribution by 10% every year after salary increments. This step-up approach can significantly improve long-term corpus versus flat SIP, even with the same return assumptions.",
            "Application step: map each goal to a SIP track. Keep one SIP for retirement, one for medium-term goals, and one for long-term wealth. This separation improves discipline and prevents confusion during market volatility."
        ],
        bestPractices: [
            "Select fund type based on goal horizon and risk profile.",
            "Treat SIP as a long-term habit, not a short-term trade.",
            "Increase SIP amount with income growth.",
            "Avoid frequent switching unless objective changes.",
            "Track expense ratio and consistency of strategy."
        ]
    },
    {
        id: "i3",
        title: "3. Stock Market Basics",
        brief: "How NSE/BSE works and introduction to fundamental and technical analysis.",
        theory: [
            "Stock markets like NSE and BSE connect capital seekers and investors through regulated trading infrastructure. Prices move based on earnings expectations, liquidity, sentiment, macro factors, and news flow.",
            "Fundamental analysis evaluates business quality, profitability, debt, management, and valuation. It answers whether a company is worth owning over a longer period based on financial and strategic strength.",
            "Technical analysis studies price and volume behavior through trends, supports, resistances, and chart structures. It supports entry, exit, and risk control decisions, especially for active participants.",
            "Real-world scenario: two investors buy the same stock. One buys because of social media hype, the other checks earnings trend, debt profile, and valuation before entry. The second investor has higher decision clarity and lower behavior-driven mistakes.",
            "Application step: combine both approaches where relevant. Use fundamentals for stock selection and technical context for position timing and risk management. This combined method improves execution quality."
        ],
        bestPractices: [
            "Do not invest based only on tips or headlines.",
            "Read at least basic financial statements before buying stocks.",
            "Use stop-loss or exit rules for active positions.",
            "Size positions according to risk tolerance.",
            "Document why you entered each stock."
        ]
    },
    {
        id: "i4",
        title: "4. Retirement Planning",
        brief: "EPF, PPF, NPS and retirement corpus estimation methods.",
        theory: [
            "Retirement planning is the process of building an income stream for years when active earning reduces or stops. Key elements include expected lifestyle cost, inflation impact, retirement age, and investment growth assumptions.",
            "In India, common retirement tools include EPF, PPF, and NPS. Each has different liquidity rules, tax treatment, and risk-return characteristics. Understanding these differences helps in building balanced retirement architecture.",
            "Corpus estimation starts with future monthly expense. Inflate current expense to retirement year, then calculate how much corpus is needed to sustain withdrawals over expected post-retirement years.",
            "Real-world scenario: a professional ignores retirement planning until age 45 and must contribute very high monthly amounts to catch up. Another starts at age 28 with smaller disciplined contributions and benefits from compounding over a longer period.",
            "Application step: create a retirement tracker with annual checkpoints. Update expected corpus, contribution rate, and asset allocation based on income changes and family goals."
        ],
        bestPractices: [
            "Start retirement contributions as early as possible.",
            "Increase retirement investment after each salary revision.",
            "Estimate post-retirement expenses using inflation-adjusted values.",
            "Use a mix of mandatory and voluntary retirement products.",
            "Reassess plan annually instead of setting once and forgetting."
        ]
    },
    {
        id: "i5",
        title: "5. Tax Planning for Investments",
        brief: "Tax-efficient strategies and long-term vs short-term gains understanding.",
        theory: [
            "Tax planning for investments focuses on maximizing post-tax return rather than only pre-tax return. The same gross return can lead to different net outcomes depending on product type, holding period, and tax treatment.",
            "Long-term and short-term capital gains are taxed differently across asset classes. Holding period discipline therefore affects your net wealth outcome and should be part of investment strategy.",
            "Tax-efficient planning also includes balancing deductions, exemptions, and liquidity needs. Products should be selected because they fit goals first and tax efficiency second, not the other way around.",
            "Real-world scenario: an investor rotates funds frequently and pays repeated short-term taxes, reducing net return. Another investor follows a planned holding strategy aligned with tax rules and retains more post-tax gains.",
            "Application step: calculate expected post-tax return before investing. Maintain an annual tax calendar for redemption planning, gain harvesting decisions, and proof management."
        ],
        bestPractices: [
            "Evaluate investments using post-tax expected return.",
            "Avoid unnecessary churn that increases tax liability.",
            "Plan holding period based on tax efficiency and goal timeline.",
            "Keep transaction records and gain statements organized.",
            "Review tax implications before rebalancing portfolio."
        ]
    }
];

const intermediateQuizBank = {
    i1: [
        {
            id: "q1",
            question: "What is the most accurate distinction between saving and investing?",
            options: [
                "Saving and investing are exactly the same",
                "Saving is for capital safety; investing is for long-term growth with risk",
                "Investing is only for experts",
                "Saving always beats inflation"
            ],
            answer: 1,
            explanation: "Savings prioritize stability; investing targets real growth over time with appropriate risk."
        },
        {
            id: "q2",
            question: "Why should returns be compared after inflation?",
            options: [
                "Because nominal returns are always enough",
                "Because inflation affects purchasing power",
                "Because inflation affects only businesses",
                "Because inflation is irrelevant for long-term goals"
            ],
            answer: 1,
            explanation: "Real return (return minus inflation) is what actually determines wealth growth."
        },
        {
            id: "q3",
            question: "A suitable approach to risk is to:",
            options: [
                "Avoid all risk always",
                "Take maximum risk for maximum return",
                "Match risk level to time horizon and goals",
                "Copy others' portfolios blindly"
            ],
            answer: 2,
            explanation: "Risk should be calibrated to your timeline and financial objective."
        },
        {
            id: "q4",
            question: "A goal-based investment structure helps because it:",
            options: [
                "Eliminates volatility",
                "Reduces decision confusion and improves allocation discipline",
                "Guarantees fixed return",
                "Removes need for emergency fund"
            ],
            answer: 1,
            explanation: "Goal mapping improves clarity on where to deploy money and for how long."
        }
    ],
    i2: [
        {
            id: "q1",
            question: "Main practical benefit of SIP is:",
            options: [
                "No market risk",
                "Perfect market timing",
                "Disciplined periodic investing across market cycles",
                "Guaranteed highest return every year"
            ],
            answer: 2,
            explanation: "SIP reduces timing pressure and builds long-term consistency."
        },
        {
            id: "q2",
            question: "Which choice usually improves long-term SIP outcomes?",
            options: [
                "Stopping SIP in every market dip",
                "Step-up SIP with income growth",
                "Switching funds every month",
                "Ignoring goal timelines"
            ],
            answer: 1,
            explanation: "Increasing contributions over time significantly supports corpus growth."
        },
        {
            id: "q3",
            question: "Fund selection should primarily be based on:",
            options: [
                "Recent one-month return only",
                "Friend recommendations only",
                "Goal horizon and risk profile",
                "Lowest NAV only"
            ],
            answer: 2,
            explanation: "Suitability to objective matters more than short-term return snapshots."
        },
        {
            id: "q4",
            question: "Creating separate SIPs per goal helps:",
            options: [
                "Increase confusion",
                "Reduce clarity in tracking",
                "Improve planning and progress visibility",
                "Avoid all investment risk"
            ],
            answer: 2,
            explanation: "Dedicated goal buckets improve control and accountability."
        }
    ],
    i3: [
        {
            id: "q1",
            question: "Fundamental analysis is mainly used for:",
            options: [
                "Checking company quality and valuation",
                "Predicting weather",
                "Ignoring financial statements",
                "Replacing risk management"
            ],
            answer: 0,
            explanation: "Fundamental analysis studies business strength, earnings, and valuation."
        },
        {
            id: "q2",
            question: "Technical analysis is useful for:",
            options: [
                "Only long-term audited statements",
                "Entry/exit and price behavior context",
                "Removing all uncertainty",
                "Avoiding position sizing"
            ],
            answer: 1,
            explanation: "Technical tools support timing and risk control decisions."
        },
        {
            id: "q3",
            question: "A disciplined stock approach should include:",
            options: [
                "Tip-based buying only",
                "No written rationale",
                "Documented entry rationale and risk plan",
                "Unlimited position size"
            ],
            answer: 2,
            explanation: "Documented plans reduce emotional decision-making."
        },
        {
            id: "q4",
            question: "Combining fundamentals and technicals can help by:",
            options: [
                "Selecting quality + improving execution timing",
                "Guaranteeing profits",
                "Removing market volatility",
                "Avoiding all analysis work"
            ],
            answer: 0,
            explanation: "Many investors use fundamentals for what to buy and technicals for when/how to execute."
        }
    ],
    i4: [
        {
            id: "q1",
            question: "Retirement corpus estimation should include:",
            options: [
                "Current lifestyle cost only",
                "Inflation-adjusted future expense assumptions",
                "Only salary growth",
                "No post-retirement duration"
            ],
            answer: 1,
            explanation: "Retirement planning must project future expense in real terms."
        },
        {
            id: "q2",
            question: "Early retirement planning is powerful because:",
            options: [
                "It eliminates all uncertainty",
                "Compounding works for a longer period",
                "No need for regular contributions",
                "It removes tax planning"
            ],
            answer: 1,
            explanation: "Time in the market amplifies compounding impact."
        },
        {
            id: "q3",
            question: "A practical retirement habit is to:",
            options: [
                "Review plan every year",
                "Set once and ignore forever",
                "Use one product for every need",
                "Pause contributions after bonus"
            ],
            answer: 0,
            explanation: "Periodic review keeps the plan aligned with changing income and life goals."
        },
        {
            id: "q4",
            question: "Which statement is most correct?",
            options: [
                "Retirement planning is only for age 50+",
                "Small early contributions can outperform late large contributions",
                "Inflation does not matter for retirement",
                "Retirement is only about tax saving"
            ],
            answer: 1,
            explanation: "Starting early allows smaller but consistent contributions to compound over decades."
        }
    ],
    i5: [
        {
            id: "q1",
            question: "The right metric for decision-making is usually:",
            options: [
                "Pre-tax return only",
                "Post-tax return aligned to goals",
                "Highest recent return only",
                "Zero-liquidity products always"
            ],
            answer: 1,
            explanation: "Post-tax outcomes determine actual wealth retained."
        },
        {
            id: "q2",
            question: "Frequent portfolio churn can:",
            options: [
                "Improve tax efficiency automatically",
                "Increase tax drag and reduce net gains",
                "Remove market risk",
                "Avoid compliance needs"
            ],
            answer: 1,
            explanation: "Short holding periods often trigger repeated taxable events."
        },
        {
            id: "q3",
            question: "Tax planning should be:",
            options: [
                "Last-minute only",
                "Integrated into annual investment plan",
                "Ignored for small portfolios",
                "Based on hearsay"
            ],
            answer: 1,
            explanation: "Early integration avoids rushed decisions and improves net outcomes."
        },
        {
            id: "q4",
            question: "A useful annual practice is:",
            options: [
                "No records",
                "Transaction and gain statement tracking",
                "Ignoring holding periods",
                "Avoiding review before redemption"
            ],
            answer: 1,
            explanation: "Clear records are essential for better planning and compliance."
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

const LEARN3I_PROGRESS_KEY = "learn3_intermediate_completed";
const completedChapters = new Set(JSON.parse(localStorage.getItem(LEARN3I_PROGRESS_KEY) || "[]"));

const chapterMeta = {
    i1: { readTime: 9, difficulty: "Intermediate" },
    i2: { readTime: 10, difficulty: "Intermediate" },
    i3: { readTime: 11, difficulty: "Intermediate" },
    i4: { readTime: 9, difficulty: "Intermediate" },
    i5: { readTime: 10, difficulty: "Advanced" }
};

const lessonVideos = {
    intermediate: {
        i1: "qIw-yFC-HNU",
        i2: "OuYvU5m2rhQ",
        i3: "hBKqk5oYexw",
        i4: "xAPowOyA0LU",
        i5: "FlXB_U91oyc"
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
    i1: {
        keyTakeaways: [
            "Saving and investing serve different time horizons.",
            "Real return matters more than nominal return.",
            "Risk should match your goal timeline."
        ],
        financialTip: "Keep emergency money separate so long-term investments are not interrupted.",
        example: "If investment return is 10% and inflation is 6%, real return is about 4%."
    },
    i2: {
        keyTakeaways: [
            "SIP builds consistency across market cycles.",
            "Step-up SIP can improve long-term outcomes.",
            "Fund selection should follow goal suitability."
        ],
        financialTip: "Set annual SIP increase aligned to salary growth for faster corpus building.",
        example: "A SIP of INR 5,000 with periodic step-ups can outperform a flat SIP over long durations."
    },
    i3: {
        keyTakeaways: [
            "Fundamentals assess business quality.",
            "Technicals support timing and risk control.",
            "Documented decisions reduce emotional mistakes."
        ],
        financialTip: "Write entry reason and exit condition before taking any stock position.",
        example: "Use fundamentals to shortlist stocks, then use trend and support zones for better entry timing."
    },
    i4: {
        keyTakeaways: [
            "Retirement planning must include inflation-adjusted expenses.",
            "Early contributions benefit from compounding.",
            "Annual review keeps plan aligned with life changes."
        ],
        financialTip: "Increase retirement contribution after every salary revision.",
        example: "Starting at age 28 usually requires lower monthly contribution than starting at age 42 for the same corpus."
    },
    i5: {
        keyTakeaways: [
            "Post-tax returns drive actual wealth outcomes.",
            "Frequent churn can reduce net gains.",
            "Tax planning should be part of annual strategy."
        ],
        financialTip: "Check tax impact before every large redemption, not after the trade.",
        example: "Holding an asset longer may reduce tax drag compared to frequent short-term switching."
    }
};

const chapterRelatedTools = {
    i1: [
        { label: "Inflation Calculator", href: "/pages/tools.html#planning-tools-title" },
        { label: "Goal Planner Calculator", href: "/pages/tools.html#popular-tools-title" }
    ],
    i2: [
        { label: "SIP Calculator", href: "/pages/tools.html#popular-tools-title" },
        { label: "Step-Up SIP Calculator", href: "/pages/tools.html#investment-tools-title" }
    ],
    i3: [
        { label: "CAGR Calculator", href: "/pages/tools.html#investment-tools-title" },
        { label: "ROI Calculator", href: "/pages/tools.html#investment-tools-title" }
    ],
    i4: [
        { label: "Retirement Calculator", href: "/pages/tools.html#popular-tools-title" },
        { label: "Inflation Calculator", href: "/pages/tools.html#planning-tools-title" }
    ],
    i5: [
        { label: "Income Tax Calculator", href: "/pages/tools.html#tax-tools-title" },
        { label: "Capital Gains Calculator", href: "/pages/tools.html#tax-tools-title" }
    ]
};

function renderLessonVideo(chapter) {
    if (!videoFrame || !chapter) return;

    const cleanTitle = chapter.title.replace(/^\d+\.\s*/, "");
    const videoId = lessonVideos.intermediate[chapter.id];

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
    localStorage.setItem(LEARN3I_PROGRESS_KEY, JSON.stringify(Array.from(completedChapters)));
}

function updateProgressUI() {
    const totalChapters = intermediateChapters.length;
    const completedCount = intermediateChapters.filter((chapter) => completedChapters.has(chapter.id)).length;
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
    topicGrid.innerHTML = intermediateChapters
        .map((chapter) => {
            const isCompleted = completedChapters.has(chapter.id);
            const metadata = chapterMeta[chapter.id] || { readTime: 9, difficulty: "Intermediate" };
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
    const questions = intermediateQuizBank[chapter.id] || [];
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
    const questions = intermediateQuizBank[chapterId] || [];
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
    const activeIndex = intermediateChapters.findIndex((chapter) => chapter.id === chapterId);
    if (activeIndex === -1) return;

    if (prevChapterBtn) {
        prevChapterBtn.disabled = activeIndex === 0;
        prevChapterBtn.dataset.targetId = intermediateChapters[activeIndex - 1]?.id || "";
    }

    if (nextChapterBtn) {
        nextChapterBtn.disabled = activeIndex === intermediateChapters.length - 1;
        nextChapterBtn.dataset.targetId = intermediateChapters[activeIndex + 1]?.id || "";
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
    const chapter = intermediateChapters.find((item) => item.id === chapterId);
    if (!chapter) return;

    document.querySelectorAll(".learn3-topic-card").forEach((card) => {
        card.classList.toggle("active", card.dataset.topicId === chapterId);
    });

    kicker.textContent = "Intermediate Level";
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
    setActiveTopic("i1");

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
