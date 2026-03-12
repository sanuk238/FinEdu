function formatINR(value) {
    return "Rs " + Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}

function calcEMI() {
    const P = +document.getElementById("emiAmount").value;
    const R = +document.getElementById("emiRate").value / 12 / 100;
    const N = +document.getElementById("emiYears").value * 12;

    if (!P || !R || !N) return showError("emiResult");

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    document.getElementById("emiResult").innerText = `Monthly EMI: ${formatINR(emi)}`;
}

function calcSIP() {
    const P = +document.getElementById("sipAmount").value;
    const R = +document.getElementById("sipRate").value / 12 / 100;
    const N = +document.getElementById("sipYears").value * 12;

    if (!P || !R || !N) return showError("sipResult");

    const futureValue = P * ((Math.pow(1 + R, N) - 1) / R) * (1 + R);
    document.getElementById("sipResult").innerText = `Future Value: ${formatINR(futureValue)}`;
}

function calcLumpsum() {
    const P = +document.getElementById("lumAmount").value;
    const R = +document.getElementById("lumRate").value / 100;
    const Y = +document.getElementById("lumYears").value;

    if (!P || !R || !Y) return showError("lumResult");

    const fv = P * Math.pow(1 + R, Y);
    document.getElementById("lumResult").innerText = `Future Value: ${formatINR(fv)}`;
}

function calcFD() {
    const P = +document.getElementById("fdAmount").value;
    const R = +document.getElementById("fdRate").value / 100;
    const Y = +document.getElementById("fdYears").value;

    if (!P || !R || !Y) return showError("fdResult");

    const maturity = P * Math.pow(1 + R, Y);
    document.getElementById("fdResult").innerText = `Maturity Value: ${formatINR(maturity)}`;
}

function calcRD() {
    const P = +document.getElementById("rdAmount").value;
    const R = +document.getElementById("rdRate").value / 400;
    const N = +document.getElementById("rdMonths").value;

    if (!P || !R || !N) return showError("rdResult");

    const maturity = P * N + P * (N * (N + 1) / 2) * R;
    document.getElementById("rdResult").innerText = `Maturity Value: ${formatINR(maturity)}`;
}

function calcROI() {
    const cost = +document.getElementById("roiCost").value;
    const value = +document.getElementById("roiValue").value;

    if (!cost || !value) return showError("roiResult");

    const roi = ((value - cost) / cost) * 100;
    document.getElementById("roiResult").innerText = `ROI: ${roi.toFixed(2)}%`;
}

function calcInflation() {
    const value = +document.getElementById("infValue").value;
    const rate = +document.getElementById("infRate").value / 100;
    const years = +document.getElementById("infYears").value;

    if (!value || !rate || !years) return showError("infResult");

    const future = value * Math.pow(1 + rate, years);
    document.getElementById("infResult").innerText = `Future Value: ${formatINR(future)}`;
}

function calcCAGR() {
    const start = +document.getElementById("cagrStart").value;
    const end = +document.getElementById("cagrEnd").value;
    const years = +document.getElementById("cagrYears").value;

    if (!start || !end || !years) return showError("cagrResult");

    const cagr = Math.pow(end / start, 1 / years) - 1;
    document.getElementById("cagrResult").innerText = `CAGR: ${(cagr * 100).toFixed(2)}%`;
}

function calcRetirement() {
    const monthly = +document.getElementById("retExpense").value;
    const years = +document.getElementById("retYears").value;

    if (!monthly || !years) return showError("retResult");

    const total = monthly * 12 * years;
    document.getElementById("retResult").innerText = `Required Corpus: ${formatINR(total)}`;
}

function calcTax() {
    const income = +document.getElementById("taxIncome").value;
    const deduction = +document.getElementById("taxDeduction").value || 0;

    if (!income) return showError("taxResult");

    const taxable = Math.max(0, income - deduction);
    const tax = taxable * 0.1;

    document.getElementById("taxResult").innerText = `Estimated Tax: ${formatINR(tax)}`;
}

function calcSavings() {
    const income = +document.getElementById("savIncome").value;
    const expense = +document.getElementById("savExpense").value;

    if (!income || !expense) return showError("savResult");

    const saving = income - expense;
    document.getElementById("savResult").innerText = `Monthly Savings: ${formatINR(saving)}`;
}

function calcExpense() {
    const daily = +document.getElementById("expDaily").value;

    if (!daily) return showError("expResult");

    const monthly = daily * 30;
    document.getElementById("expResult").innerText = `Estimated Monthly Expense: ${formatINR(monthly)}`;
}

function calcGoalPlanner() {
    const target = +document.getElementById("goalTarget").value;
    const years = +document.getElementById("goalYears").value;
    const annualReturn = +document.getElementById("goalReturn").value / 100;

    if (!target || !years || annualReturn < 0) return showError("goalResult");

    const months = years * 12;
    const monthlyRate = annualReturn / 12;
    const monthlyRequired = monthlyRate > 0
        ? target * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1)
        : target / months;

    document.getElementById("goalResult").innerText = `Required Monthly Investment: ${formatINR(monthlyRequired)}`;
}

function calcStepUpSIP() {
    const monthlySip = +document.getElementById("stepSipAmount").value;
    const annualIncrease = +document.getElementById("stepSipIncrease").value / 100;
    const annualReturn = +document.getElementById("stepSipRate").value / 100;
    const years = +document.getElementById("stepSipYears").value;

    if (!monthlySip || annualIncrease < 0 || annualReturn < 0 || !years) return showError("stepSipResult");

    let corpus = 0;
    let currentSip = monthlySip;
    const monthlyRate = annualReturn / 12;
    const totalMonths = years * 12;

    for (let month = 1; month <= totalMonths; month++) {
        corpus = (corpus + currentSip) * (1 + monthlyRate);
        if (month % 12 === 0) {
            currentSip = currentSip * (1 + annualIncrease);
        }
    }

    document.getElementById("stepSipResult").innerText = `Estimated Corpus: ${formatINR(corpus)}`;
}

function calcLoanEligibility() {
    const income = +document.getElementById("loanInc").value;
    const emis = +document.getElementById("loanEmis").value;
    const annualRate = +document.getElementById("loanRate").value / 100;
    const years = +document.getElementById("loanTenure").value;

    if (!income || emis < 0 || annualRate < 0 || !years) return showError("loanEligResult");

    const eligibleEmi = Math.max(0, income * 0.5 - emis);
    const n = years * 12;
    const r = annualRate / 12;
    const principal = r > 0
        ? eligibleEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))
        : eligibleEmi * n;

    document.getElementById("loanEligResult").innerText = `Estimated Loan Eligibility: ${formatINR(principal)}`;
}

function calcLoanPrepayment() {
    const P = +document.getElementById("preLoanAmount").value;
    const annualRate = +document.getElementById("preLoanRate").value / 100;
    const years = +document.getElementById("preLoanYears").value;
    const extra = +document.getElementById("preExtraPay").value;

    if (!P || annualRate < 0 || !years || extra < 0) return showError("prepayResult");

    const n = years * 12;
    const r = annualRate / 12;
    const emi = r > 0
        ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        : P / n;

    const revisedEmi = emi + extra;
    let revisedMonths;

    if (r > 0) {
        const ratio = revisedEmi / (revisedEmi - P * r);
        revisedMonths = ratio > 1 ? Math.ceil(Math.log(ratio) / Math.log(1 + r)) : n;
    } else {
        revisedMonths = Math.ceil(P / revisedEmi);
    }

    const monthsSaved = Math.max(0, n - revisedMonths);
    document.getElementById("prepayResult").innerText = `New Tenure: ${revisedMonths} months | Months Saved: ${monthsSaved}`;
}

function calcCapitalGains() {
    const buy = +document.getElementById("cgBuyPrice").value;
    const sell = +document.getElementById("cgSellPrice").value;
    const qty = +document.getElementById("cgQty").value;
    const holdMonths = +document.getElementById("cgHold").value;

    if (!buy || !sell || !qty || !holdMonths) return showError("cgResult");

    const gain = (sell - buy) * qty;
    const taxRate = holdMonths > 24 ? 0.125 : 0.2;
    const tax = Math.max(0, gain * taxRate);
    document.getElementById("cgResult").innerText = `Capital Gain: ${formatINR(gain)} | Estimated Tax: ${formatINR(tax)}`;
}

function calcNetWorth() {
    const assets = +document.getElementById("nwAssets").value;
    const liabilities = +document.getElementById("nwLiabilities").value;

    if (!assets || liabilities < 0) return showError("nwResult");

    const netWorth = assets - liabilities;
    document.getElementById("nwResult").innerText = `Net Worth: ${formatINR(netWorth)}`;
}

function calcEmergencyFund() {
    const monthlyExpense = +document.getElementById("efExpense").value;
    const months = +document.getElementById("efMonths").value;

    if (!monthlyExpense || !months) return showError("efResult");

    const fund = monthlyExpense * months;
    document.getElementById("efResult").innerText = `Emergency Fund Needed: ${formatINR(fund)}`;
}

window.calcEMI = calcEMI;
window.calcSIP = calcSIP;
window.calcLumpsum = calcLumpsum;
window.calcFD = calcFD;
window.calcRD = calcRD;
window.calcROI = calcROI;
window.calcInflation = calcInflation;
window.calcCAGR = calcCAGR;
window.calcRetirement = calcRetirement;
window.calcTax = calcTax;
window.calcSavings = calcSavings;
window.calcExpense = calcExpense;
window.calcGoalPlanner = calcGoalPlanner;
window.calcStepUpSIP = calcStepUpSIP;
window.calcLoanEligibility = calcLoanEligibility;
window.calcLoanPrepayment = calcLoanPrepayment;
window.calcCapitalGains = calcCapitalGains;
window.calcNetWorth = calcNetWorth;
window.calcEmergencyFund = calcEmergencyFund;

function showError(id) {
    document.getElementById(id).innerText = "Please enter valid values";
}

// Chart layer: reads existing result values and visualizes them without changing calculator logic.
(function setupCalculatorCharts() {
    const charts = {};

    function parseCurrency(text) {
        if (!text) return NaN;
        const match = text.match(/Rs\s*([\d,]+(?:\.\d+)?)/i);
        return match ? Number(match[1].replace(/,/g, "")) : NaN;
    }

    function showWrap(wrapId, shouldShow) {
        const wrap = document.getElementById(wrapId);
        if (!wrap) return;
        wrap.classList.toggle("is-visible", !!shouldShow);
    }

    function buildOrUpdateChart(key, canvasId, config) {
        if (!window.Chart) return;
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        if (charts[key]) {
            charts[key].destroy();
        }

        charts[key] = new Chart(canvas.getContext("2d"), config);
    }

    function clearChart(key, wrapId) {
        if (charts[key]) {
            charts[key].destroy();
            delete charts[key];
        }
        showWrap(wrapId, false);
    }

    function lineSeriesFromStartEnd(start, end, steps) {
        const safeSteps = Math.max(1, steps);
        if (start <= 0 || end <= 0) {
            return Array.from({ length: safeSteps + 1 }, (_, i) => (end / safeSteps) * i);
        }
        const r = Math.pow(end / start, 1 / safeSteps) - 1;
        return Array.from({ length: safeSteps + 1 }, (_, i) => start * Math.pow(1 + r, i));
    }

    function renderSIPChart() {
        const futureValue = parseCurrency(document.getElementById("sipResult")?.innerText || "");
        const monthly = +document.getElementById("sipAmount")?.value;
        const years = +document.getElementById("sipYears")?.value;
        const invested = monthly * years * 12;

        if (!(futureValue > 0) || !(invested > 0)) {
            clearChart("sip", "sipChartWrap");
            return;
        }

        const returns = Math.max(0, futureValue - invested);
        showWrap("sipChartWrap", true);
        buildOrUpdateChart("sip", "sipChart", {
            type: "doughnut",
            data: {
                labels: ["Invested", "Returns"],
                datasets: [{
                    data: [invested, returns],
                    backgroundColor: ["#2563eb", "#16a34a"],
                    borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    function renderEMIChart() {
        const emiValueText = document.getElementById("emiResult")?.innerText || "";
        const monthlyEmi = parseCurrency(emiValueText);
        const principal = +document.getElementById("emiAmount")?.value;
        const years = +document.getElementById("emiYears")?.value;
        const months = years * 12;

        if (!(monthlyEmi > 0) || !(principal > 0) || !(months > 0)) {
            clearChart("emi", "emiChartWrap");
            return;
        }

        const total = monthlyEmi * months;
        const interest = Math.max(0, total - principal);
        showWrap("emiChartWrap", true);
        buildOrUpdateChart("emi", "emiChart", {
            type: "pie",
            data: {
                labels: ["Principal", "Interest"],
                datasets: [{
                    data: [principal, interest],
                    backgroundColor: ["#1d4ed8", "#f59e0b"],
                    borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    function renderGrowthChart(key, wrapId, canvasId, resultId, startValue, periods, labelPrefix) {
        const finalValue = parseCurrency(document.getElementById(resultId)?.innerText || "");
        if (!(finalValue > 0) || !(startValue > 0) || !(periods > 0)) {
            clearChart(key, wrapId);
            return;
        }

        const steps = Math.max(4, Math.round(periods));
        const labels = Array.from({ length: steps + 1 }, (_, i) => `${labelPrefix} ${i}`);
        const series = lineSeriesFromStartEnd(startValue, finalValue, steps);

        showWrap(wrapId, true);
        buildOrUpdateChart(key, canvasId, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Growth",
                    data: series,
                    borderColor: "#2563eb",
                    backgroundColor: "rgba(37,99,235,0.14)",
                    pointRadius: 0,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    function renderFDChart() {
        const principal = +document.getElementById("fdAmount")?.value;
        const years = +document.getElementById("fdYears")?.value;
        renderGrowthChart("fd", "fdChartWrap", "fdChart", "fdResult", principal, years, "Year");
    }

    function renderLumpsumChart() {
        const principal = +document.getElementById("lumAmount")?.value;
        const years = +document.getElementById("lumYears")?.value;
        renderGrowthChart("lum", "lumChartWrap", "lumChart", "lumResult", principal, years, "Year");
    }

    function renderRDChart() {
        const monthly = +document.getElementById("rdAmount")?.value;
        const months = +document.getElementById("rdMonths")?.value;
        const finalValue = parseCurrency(document.getElementById("rdResult")?.innerText || "");

        if (!(finalValue > 0) || !(monthly > 0) || !(months > 0)) {
            clearChart("rd", "rdChartWrap");
            return;
        }

        const labels = Array.from({ length: months + 1 }, (_, i) => `M${i}`);
        const contribution = monthly * months;
        const gain = Math.max(0, finalValue - contribution);
        const series = Array.from({ length: months + 1 }, (_, i) => {
            const contributed = monthly * i;
            const gainPart = gain * Math.pow(i / months, 2);
            return contributed + gainPart;
        });

        showWrap("rdChartWrap", true);
        buildOrUpdateChart("rd", "rdChart", {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Growth",
                    data: series,
                    borderColor: "#7c3aed",
                    backgroundColor: "rgba(124,58,237,0.14)",
                    pointRadius: 0,
                    tension: 0.28,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    function renderExpenseChart() {
        const monthlyExpense = parseCurrency(document.getElementById("expResult")?.innerText || "");
        if (!(monthlyExpense > 0)) {
            clearChart("exp", "expChartWrap");
            return;
        }

        const categories = [
            monthlyExpense * 0.4,
            monthlyExpense * 0.25,
            monthlyExpense * 0.15,
            monthlyExpense * 0.1,
            monthlyExpense * 0.1
        ];

        showWrap("expChartWrap", true);
        buildOrUpdateChart("exp", "expChart", {
            type: "pie",
            data: {
                labels: ["Essentials", "Food", "Transport", "Utilities", "Other"],
                datasets: [{
                    data: categories,
                    backgroundColor: ["#1d4ed8", "#16a34a", "#d97706", "#9333ea", "#dc2626"],
                    borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const clickRenderers = {
        calcSIP: renderSIPChart,
        calcEMI: renderEMIChart,
        calcFD: renderFDChart,
        calcRD: renderRDChart,
        calcLumpsum: renderLumpsumChart,
        calcExpense: renderExpenseChart
    };

    window.toolsChartRenderers = {
        sip: renderSIPChart
    };

    document.addEventListener("DOMContentLoaded", () => {
        Object.entries(clickRenderers).forEach(([fnName, renderer]) => {
            const button = document.querySelector(`button[onclick=\"${fnName}()\"]`);
            if (!button) return;
            button.addEventListener("click", () => {
                setTimeout(renderer, 0);
            });
        });
    });
})();

// Result card presentation layer: formats existing result strings into richer UI blocks.
(function setupResultCards() {
    function parseRs(text) {
        if (!text) return NaN;
        const match = text.match(/Rs\s*([\d,]+(?:\.\d+)?)/i);
        return match ? Number(match[1].replace(/,/g, "")) : NaN;
    }

    function toINR(value) {
        if (!Number.isFinite(value)) return "-";
        return `\u20B9${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
    }

    function isErrorText(text) {
        return /please enter valid values/i.test(text || "");
    }

    function moneyRow(label, value) {
        return { label, value: toINR(value) };
    }

    function percentRow(label, value) {
        return { label, value: `${Number(value).toFixed(2)}%` };
    }

    function animateTextValue(el, finalText, durationMs) {
        if (!el || !finalText) return;

        const currencyMatch = finalText.match(/^\u20B9\s*([\d,]+(?:\.\d+)?)$/);
        const percentMatch = finalText.match(/^([\d,]+(?:\.\d+)?)%$/);

        if (!currencyMatch && !percentMatch) {
            el.textContent = finalText;
            return;
        }

        const isCurrency = !!currencyMatch;
        const target = Number((isCurrency ? currencyMatch[1] : percentMatch[1]).replace(/,/g, ""));
        if (!Number.isFinite(target)) {
            el.textContent = finalText;
            return;
        }

        const start = 0;
        const startTime = performance.now();
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);

        function renderFrame(now) {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / durationMs);
            const eased = easeOut(progress);
            const current = start + (target - start) * eased;

            if (isCurrency) {
                el.textContent = `\u20B9${current.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
            } else {
                el.textContent = `${current.toFixed(2)}%`;
            }

            if (progress < 1) {
                requestAnimationFrame(renderFrame);
                return;
            }

            el.textContent = finalText;
        }

        requestAnimationFrame(renderFrame);
    }

    function getResultModel(resultId, rawText) {
        const amount = parseRs(rawText);
        const defaults = {
            label: rawText.split(":")[0] || "Estimated Value",
            primary: Number.isFinite(amount) ? toINR(amount) : rawText,
            rows: []
        };

        if (resultId === "sipResult") {
            const monthly = +document.getElementById("sipAmount")?.value || 0;
            const years = +document.getElementById("sipYears")?.value || 0;
            const invested = monthly * years * 12;
            const returns = Math.max(0, amount - invested);
            return {
                label: "Estimated Value",
                primary: toINR(amount),
                rows: [moneyRow("Invested Amount", invested), moneyRow("Total Returns", returns)]
            };
        }

        if (resultId === "emiResult") {
            const principal = +document.getElementById("emiAmount")?.value || 0;
            const years = +document.getElementById("emiYears")?.value || 0;
            const totalPayment = amount * years * 12;
            const interest = Math.max(0, totalPayment - principal);
            return {
                label: "Monthly EMI",
                primary: toINR(amount),
                rows: [moneyRow("Principal", principal), moneyRow("Total Interest", interest)]
            };
        }

        if (resultId === "lumResult") {
            const principal = +document.getElementById("lumAmount")?.value || 0;
            return {
                label: "Estimated Value",
                primary: toINR(amount),
                rows: [moneyRow("Invested Amount", principal), moneyRow("Total Returns", Math.max(0, amount - principal))]
            };
        }

        if (resultId === "fdResult") {
            const principal = +document.getElementById("fdAmount")?.value || 0;
            return {
                label: "Maturity Value",
                primary: toINR(amount),
                rows: [moneyRow("Principal", principal), moneyRow("Interest Earned", Math.max(0, amount - principal))]
            };
        }

        if (resultId === "rdResult") {
            const monthly = +document.getElementById("rdAmount")?.value || 0;
            const months = +document.getElementById("rdMonths")?.value || 0;
            const invested = monthly * months;
            return {
                label: "Maturity Value",
                primary: toINR(amount),
                rows: [moneyRow("Total Deposits", invested), moneyRow("Interest Earned", Math.max(0, amount - invested))]
            };
        }

        if (resultId === "roiResult") {
            const cost = +document.getElementById("roiCost")?.value || 0;
            const finalValue = +document.getElementById("roiValue")?.value || 0;
            const roi = Number((rawText.match(/([\d.]+)%/) || [])[1] || 0);
            return {
                label: "Return On Investment",
                primary: `${roi.toFixed(2)}%`,
                rows: [moneyRow("Investment Cost", cost), moneyRow("Final Value", finalValue)]
            };
        }

        if (resultId === "infResult") {
            const today = +document.getElementById("infValue")?.value || 0;
            return {
                label: "Future Value",
                primary: toINR(amount),
                rows: [moneyRow("Today's Value", today), moneyRow("Value Increase", Math.max(0, amount - today))]
            };
        }

        if (resultId === "cagrResult") {
            const start = +document.getElementById("cagrStart")?.value || 0;
            const end = +document.getElementById("cagrEnd")?.value || 0;
            const cagr = Number((rawText.match(/([\d.]+)%/) || [])[1] || 0);
            return {
                label: "Compound Annual Growth",
                primary: `${cagr.toFixed(2)}%`,
                rows: [moneyRow("Start Value", start), moneyRow("End Value", end)]
            };
        }

        if (resultId === "retResult") {
            const monthly = +document.getElementById("retExpense")?.value || 0;
            const years = +document.getElementById("retYears")?.value || 0;
            return {
                label: "Required Corpus",
                primary: toINR(amount),
                rows: [moneyRow("Current Monthly Expense", monthly), { label: "Retirement Period", value: `${years} years` }]
            };
        }

        if (resultId === "taxResult") {
            const income = +document.getElementById("taxIncome")?.value || 0;
            const deduction = +document.getElementById("taxDeduction")?.value || 0;
            return {
                label: "Estimated Tax",
                primary: toINR(amount),
                rows: [moneyRow("Annual Income", income), moneyRow("Deductions", deduction)]
            };
        }

        if (resultId === "savResult") {
            const income = +document.getElementById("savIncome")?.value || 0;
            const expense = +document.getElementById("savExpense")?.value || 0;
            const ratio = income > 0 ? (amount / income) * 100 : 0;
            return {
                label: "Monthly Savings",
                primary: toINR(amount),
                rows: [moneyRow("Monthly Income", income), percentRow("Savings Rate", ratio)]
            };
        }

        if (resultId === "expResult") {
            const daily = +document.getElementById("expDaily")?.value || 0;
            return {
                label: "Estimated Monthly Expense",
                primary: toINR(amount),
                rows: [moneyRow("Daily Expense", daily), moneyRow("Weekly Expense", daily * 7)]
            };
        }

        return defaults;
    }

    function renderResultCard(resultId) {
        const el = document.getElementById(resultId);
        if (!el) return;

        el.classList.remove("result-show");
        void el.offsetWidth;
        el.classList.add("result-show");

        const rawText = (el.dataset.rawResult || el.innerText || "").trim();
        if (!rawText) {
            el.classList.remove("result-error");
            document.dispatchEvent(new CustomEvent("calculator:result-updated", {
                detail: { resultId, rawText: "", isError: true }
            }));
            return;
        }

        if (isErrorText(rawText)) {
            el.classList.add("result-error");
            el.textContent = rawText;
            document.dispatchEvent(new CustomEvent("calculator:result-updated", {
                detail: { resultId, rawText, isError: true }
            }));
            return;
        }

        el.classList.remove("result-error");
        const model = getResultModel(resultId, rawText);
        const rowsHtml = model.rows
            .map((row) => `<div class="result-row"><span>${row.label}</span><span>${row.value}</span></div>`)
            .join("");

        el.innerHTML = `
            <div class="result-label">${model.label}</div>
            <div class="result-value">${model.primary}</div>
            <div class="result-meta">${rowsHtml}</div>
        `;

        const valueEl = el.querySelector(".result-value");
        animateTextValue(valueEl, model.primary, 850);

        document.dispatchEvent(new CustomEvent("calculator:result-updated", {
            detail: { resultId, rawText, isError: false, model }
        }));
    }

    window.renderResultCardUI = renderResultCard;

    const fnToResultId = {
        calcEMI: "emiResult",
        calcSIP: "sipResult",
        calcLumpsum: "lumResult",
        calcFD: "fdResult",
        calcRD: "rdResult",
        calcROI: "roiResult",
        calcInflation: "infResult",
        calcCAGR: "cagrResult",
        calcRetirement: "retResult",
        calcTax: "taxResult",
        calcSavings: "savResult",
        calcExpense: "expResult"
    };

    document.addEventListener("DOMContentLoaded", () => {
        Object.entries(fnToResultId).forEach(([fnName, resultId]) => {
            const button = document.querySelector(`button[onclick="${fnName}()"]`);
            if (!button) return;

            button.addEventListener("click", () => {
                const resultEl = document.getElementById(resultId);
                if (!resultEl) return;
                setTimeout(() => {
                    resultEl.dataset.rawResult = (resultEl.innerText || "").trim();
                    renderResultCard(resultId);
                }, 0);
            });
        });
    });
})();

// Animation layer: card entrance staggering and button click micro-interaction.
(function setupCalculatorAnimations() {
    document.addEventListener("DOMContentLoaded", () => {
        const cards = document.querySelectorAll(".calc-card");
        cards.forEach((card, index) => {
            card.style.setProperty("--enter-delay", `${index * 45}ms`);
        });

        const buttons = document.querySelectorAll(".calc-card button");
        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                btn.classList.remove("btn-pop");
                void btn.offsetWidth;
                btn.classList.add("btn-pop");
            });
            btn.addEventListener("animationend", () => {
                btn.classList.remove("btn-pop");
            });
        });
    });
})();


// Save calculation layer: persists calculated outputs in localStorage.
(function setupSavedCalculations() {
    const STORAGE_KEY = "finedu_saved_calculations_v1";

    const resultToConfig = {
        sipResult: { calcName: "SIP Plan", fnName: "calcSIP", title: "SIP Calculator" },
        emiResult: { calcName: "EMI Plan", fnName: "calcEMI", title: "EMI Calculator" },
        lumResult: { calcName: "Lumpsum Plan", fnName: "calcLumpsum", title: "Lumpsum Calculator" },
        fdResult: { calcName: "FD Plan", fnName: "calcFD", title: "FD Calculator" },
        rdResult: { calcName: "RD Plan", fnName: "calcRD", title: "RD Calculator" },
        roiResult: { calcName: "ROI Plan", fnName: "calcROI", title: "ROI Calculator" },
        infResult: { calcName: "Inflation Plan", fnName: "calcInflation", title: "Inflation Calculator" },
        cagrResult: { calcName: "CAGR Plan", fnName: "calcCAGR", title: "CAGR Calculator" },
        retResult: { calcName: "Retirement Plan", fnName: "calcRetirement", title: "Retirement Calculator" },
        taxResult: { calcName: "Tax Plan", fnName: "calcTax", title: "Income Tax Calculator" },
        savResult: { calcName: "Savings Plan", fnName: "calcSavings", title: "Savings Calculator" },
        expResult: { calcName: "Expense Plan", fnName: "calcExpense", title: "Expense Tracker" }
    };

    function readSaved() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function writeSaved(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function getPrimaryText(resultEl) {
        const valueEl = resultEl.querySelector(".result-value");
        if (valueEl) return (valueEl.textContent || "").trim();
        return (resultEl.dataset.rawResult || resultEl.innerText || "").trim();
    }

    function buildSummary(resultId, primaryText) {
        if (resultId === "sipResult") {
            const monthly = +document.getElementById("sipAmount")?.value || 0;
            const years = +document.getElementById("sipYears")?.value || 0;
            return `SIP Plan - \u20B9${monthly.toLocaleString("en-IN")}/month for ${years} years`;
        }
        return `${resultToConfig[resultId].title} - ${primaryText}`;
    }

    function renderList() {
        const list = document.getElementById("savedCalcsList");
        if (!list) return;

        const items = readSaved();
        if (!items.length) {
            list.innerHTML = '<div class="saved-calcs-empty">No saved calculations yet. Calculate and tap "Save Result".</div>';
            return;
        }

        list.innerHTML = items
            .map((item) => `
                <div class="saved-item">
                    <div class="saved-item-title">${item.summary}</div>
                    <div class="saved-item-meta">${item.calculator} | ${item.savedAt}</div>
                </div>
            `)
            .join("");
    }

    function saveFromResult(resultId) {
        const config = resultToConfig[resultId];
        if (!config) return;

        const resultEl = document.getElementById(resultId);
        if (!resultEl) return;

        const rawText = (resultEl.dataset.rawResult || resultEl.innerText || "").trim();
        if (!rawText || /please enter valid values/i.test(rawText)) return;

        const primaryText = getPrimaryText(resultEl);
        const items = readSaved();
        const now = new Date();
        const savedAt = `${now.toLocaleDateString("en-IN")} ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
        const next = [{
            id: `${Date.now()}_${Math.random().toString(16).slice(2, 7)}`,
            calculator: config.title,
            summary: buildSummary(resultId, primaryText),
            result: primaryText,
            savedAt
        }, ...items].slice(0, 30);

        writeSaved(next);
        renderList();
    }

    function setSaveButtonState(resultId, enabled) {
        const btn = document.querySelector(`.save-calc-btn[data-result-id="${resultId}"]`);
        if (!btn) return;
        btn.disabled = !enabled;
    }

    function injectSaveButtons() {
        Object.entries(resultToConfig).forEach(([resultId, cfg]) => {
            const calcBtn = document.querySelector(`button[onclick="${cfg.fnName}()"]`);
            if (!calcBtn || calcBtn.parentNode.querySelector(`.save-calc-btn[data-result-id="${resultId}"]`)) return;

            const saveBtn = document.createElement("button");
            saveBtn.type = "button";
            saveBtn.className = "save-calc-btn";
            saveBtn.textContent = "Save Result";
            saveBtn.dataset.resultId = resultId;
            saveBtn.disabled = true;
            saveBtn.addEventListener("click", () => saveFromResult(resultId));
            calcBtn.parentNode.insertBefore(saveBtn, calcBtn.nextSibling);
        });
    }

    function injectPanel() {
        const sections = document.querySelector(".tools-sections");
        if (!sections || document.getElementById("savedCalcsPanel")) return;

        const panel = document.createElement("section");
        panel.className = "saved-calcs-panel";
        panel.id = "savedCalcsPanel";
        panel.innerHTML = `
            <div class="saved-calcs-head">
                <h2 class="saved-calcs-title">Saved Calculations</h2>
                <button type="button" class="saved-calcs-clear" id="savedCalcsClearBtn">Clear All</button>
            </div>
            <div class="saved-calcs-list" id="savedCalcsList"></div>
        `;

        sections.insertBefore(panel, sections.firstChild);

        const clearBtn = panel.querySelector("#savedCalcsClearBtn");
        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                writeSaved([]);
                renderList();
            });
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        injectPanel();
        injectSaveButtons();
        renderList();
    });

    document.addEventListener("calculator:result-updated", (event) => {
        const detail = event.detail || {};
        if (!detail.resultId) return;
        setSaveButtonState(detail.resultId, !detail.isError && !!detail.rawText);
    });
})();

// Insight layer: builds simple educational messages from already computed outputs.
(function setupCalculationInsights() {
    function parseRs(text) {
        if (!text) return NaN;
        const match = text.match(/Rs\s*([\d,]+(?:\.\d+)?)/i);
        return match ? Number(match[1].replace(/,/g, "")) : NaN;
    }

    function toINR(value) {
        return `\u20B9${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
    }

    function ensureInsightEl(resultEl, resultId) {
        const card = resultEl.closest(".calc-card");
        if (!card) return null;

        let insight = card.querySelector(`.calc-insight[data-for="${resultId}"]`);
        if (!insight) {
            insight = document.createElement("div");
            insight.className = "calc-insight";
            insight.dataset.for = resultId;
            resultEl.insertAdjacentElement("afterend", insight);
        }
        return insight;
    }

    function getInsightText(resultId, rawText) {
        const amount = parseRs(rawText);

        if (resultId === "sipResult" && amount > 0) {
            const monthly = +document.getElementById("sipAmount")?.value || 0;
            const years = +document.getElementById("sipYears")?.value || 0;
            return `Investing <strong>${toINR(monthly)}</strong> monthly for <strong>${years} years</strong> could grow to about <strong>${toINR(amount)}</strong>.`;
        }

        if (resultId === "emiResult" && amount > 0) {
            const years = +document.getElementById("emiYears")?.value || 0;
            return `An EMI of <strong>${toINR(amount)}</strong> over <strong>${years} years</strong> helps you estimate long-term loan affordability.`;
        }

        if (resultId === "fdResult" && amount > 0) {
            const principal = +document.getElementById("fdAmount")?.value || 0;
            return `A principal of <strong>${toINR(principal)}</strong> may mature to <strong>${toINR(amount)}</strong>, showing the power of fixed compounding.`;
        }

        if (resultId === "lumResult" && amount > 0) {
            const principal = +document.getElementById("lumAmount")?.value || 0;
            return `A one-time investment of <strong>${toINR(principal)}</strong> can potentially become <strong>${toINR(amount)}</strong> with long-term growth.`;
        }

        if (resultId === "rdResult" && amount > 0) {
            const monthly = +document.getElementById("rdAmount")?.value || 0;
            const months = +document.getElementById("rdMonths")?.value || 0;
            return `Contributing <strong>${toINR(monthly)}</strong> monthly for <strong>${months} months</strong> can build discipline and grow to <strong>${toINR(amount)}</strong>.`;
        }

        if (resultId === "retResult" && amount > 0) {
            return `Your estimated retirement corpus is <strong>${toINR(amount)}</strong>, which can guide your long-term savings target.`;
        }

        if (resultId === "savResult" && amount > 0) {
            return `Saving around <strong>${toINR(amount)}</strong> monthly can significantly improve emergency readiness and investment capacity.`;
        }

        if (resultId === "expResult" && amount > 0) {
            return `Tracking a monthly expense near <strong>${toINR(amount)}</strong> helps identify opportunities to improve savings consistency.`;
        }

        if (resultId === "infResult" && amount > 0) {
            return `Projected future value of <strong>${toINR(amount)}</strong> highlights how inflation can change purchasing needs over time.`;
        }

        if (resultId === "taxResult" && amount > 0) {
            return `An estimated tax of <strong>${toINR(amount)}</strong> can help plan deductions and avoid year-end surprises.`;
        }

        if (resultId === "roiResult") {
            const m = rawText.match(/([\d.]+)%/);
            if (m) {
                return `An ROI of <strong>${Number(m[1]).toFixed(2)}%</strong> indicates how efficiently your invested capital is performing.`;
            }
        }

        if (resultId === "cagrResult") {
            const m = rawText.match(/([\d.]+)%/);
            if (m) {
                return `A CAGR of <strong>${Number(m[1]).toFixed(2)}%</strong> reflects your annualized growth pace over the selected period.`;
            }
        }

        return "";
    }

    document.addEventListener("calculator:result-updated", (event) => {
        const detail = event.detail || {};
        if (!detail.resultId) return;

        const resultEl = document.getElementById(detail.resultId);
        if (!resultEl) return;

        const insightEl = ensureInsightEl(resultEl, detail.resultId);
        if (!insightEl) return;

        const rawText = (detail.rawText || "").trim();
        if (detail.isError || !rawText) {
            insightEl.classList.remove("is-visible");
            insightEl.innerHTML = "";
            return;
        }

        const message = getInsightText(detail.resultId, rawText);
        if (!message) {
            insightEl.classList.remove("is-visible");
            insightEl.innerHTML = "";
            return;
        }

        insightEl.innerHTML = message;
        insightEl.classList.add("is-visible");
    });
})();

// Search/filter layer: filters calculator cards by name in real time.
(function setupCalculatorSearch() {
    function normalize(value) {
        return (value || "").toLowerCase().trim();
    }

    function applyFilter(term) {
        const search = normalize(term);
        const cards = document.querySelectorAll(".calc-card");

        cards.forEach((card) => {
            const titleEl = card.querySelector(".calc-title span:last-child") || card.querySelector("h3");
            const title = normalize(titleEl ? titleEl.textContent : "");
            const isMatch = !search || title.includes(search);
            card.style.display = isMatch ? "" : "none";
        });

        const sections = document.querySelectorAll(".tools-section");
        sections.forEach((section) => {
            const hasVisible = Array.from(section.querySelectorAll(".calc-card")).some((card) => card.style.display !== "none");
            section.style.display = hasVisible ? "" : "none";
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        const searchInput = document.getElementById("calculatorSearch");
        if (!searchInput) return;

        searchInput.addEventListener("input", () => {
            applyFilter(searchInput.value);
        });
    });
})();

// Validation layer: prevents invalid submissions before existing calculator handlers run.
(function setupCalculatorValidation() {
    function getInput(id) {
        return document.getElementById(id);
    }

    function getNumber(input) {
        if (!input) return NaN;
        return Number(input.value);
    }

    function ensureErrorEl(input) {
        if (!input) return null;
        let err = input.nextElementSibling;
        if (!err || !err.classList || !err.classList.contains("input-error-msg")) {
            err = document.createElement("div");
            err.className = "input-error-msg";
            input.insertAdjacentElement("afterend", err);
        }
        return err;
    }

    function showFieldError(input, message) {
        if (!input) return;
        input.classList.add("input-invalid");
        const err = ensureErrorEl(input);
        if (err) err.textContent = message;
    }

    function clearFieldError(input) {
        if (!input) return;
        input.classList.remove("input-invalid");
        const err = ensureErrorEl(input);
        if (err) err.textContent = "";
    }

    function positiveRule(id, message) {
        return {
            id,
            validate: (value) => Number.isFinite(value) && value > 0,
            message
        };
    }

    function betweenRule(id, min, max, message) {
        return {
            id,
            validate: (value) => Number.isFinite(value) && value >= min && value <= max,
            message
        };
    }

    function nonNegativeRule(id, message) {
        return {
            id,
            validate: (value) => Number.isFinite(value) && value >= 0,
            message
        };
    }

    const validationRules = {
        calcEMI: [
            positiveRule("emiAmount", "Loan amount must be a positive value."),
            betweenRule("emiRate", 0, 30, "Interest rate must be between 0 and 30%."),
            betweenRule("emiYears", 1, 50, "Years must be between 1 and 50.")
        ],
        calcSIP: [
            positiveRule("sipAmount", "Monthly investment must be a positive value."),
            betweenRule("sipRate", 0, 30, "Return rate must be between 0 and 30%."),
            betweenRule("sipYears", 1, 50, "Years must be between 1 and 50.")
        ],
        calcLumpsum: [
            positiveRule("lumAmount", "Investment amount must be a positive value."),
            betweenRule("lumRate", 0, 30, "Return rate must be between 0 and 30%."),
            betweenRule("lumYears", 1, 50, "Years must be between 1 and 50.")
        ],
        calcFD: [
            positiveRule("fdAmount", "Principal must be a positive value."),
            betweenRule("fdRate", 0, 30, "Interest rate must be between 0 and 30%."),
            betweenRule("fdYears", 1, 50, "Years must be between 1 and 50.")
        ],
        calcRD: [
            positiveRule("rdAmount", "Monthly deposit must be a positive value."),
            betweenRule("rdRate", 0, 30, "Interest rate must be between 0 and 30%."),
            betweenRule("rdMonths", 1, 600, "Months must be between 1 and 600.")
        ],
        calcROI: [
            positiveRule("roiCost", "Investment cost must be a positive value."),
            positiveRule("roiValue", "Final value must be a positive value.")
        ],
        calcInflation: [
            positiveRule("infValue", "Today's value must be a positive value."),
            betweenRule("infRate", 0, 30, "Inflation rate must be between 0 and 30%."),
            betweenRule("infYears", 1, 50, "Years must be between 1 and 50.")
        ],
        calcCAGR: [
            positiveRule("cagrStart", "Start value must be a positive value."),
            positiveRule("cagrEnd", "End value must be a positive value."),
            betweenRule("cagrYears", 1, 50, "Years must be between 1 and 50.")
        ],
        calcRetirement: [
            positiveRule("retExpense", "Monthly expense must be a positive value."),
            betweenRule("retYears", 1, 50, "Years must be between 1 and 50.")
        ],
        calcTax: [
            positiveRule("taxIncome", "Annual income must be a positive value."),
            nonNegativeRule("taxDeduction", "Deductions cannot be negative.")
        ],
        calcSavings: [
            positiveRule("savIncome", "Monthly income must be a positive value."),
            nonNegativeRule("savExpense", "Monthly expense cannot be negative.")
        ],
        calcExpense: [
            positiveRule("expDaily", "Daily expense must be a positive value.")
        ]
    };

    function validateForFunction(fnName) {
        const rules = validationRules[fnName] || [];
        let firstInvalid = null;

        rules.forEach((rule) => {
            const input = getInput(rule.id);
            if (!input) return;

            const value = getNumber(input);
            if (rule.validate(value)) {
                clearFieldError(input);
                return;
            }

            showFieldError(input, rule.message);
            if (!firstInvalid) firstInvalid = input;
        });

        return !firstInvalid ? { valid: true } : { valid: false, firstInvalid };
    }

    document.addEventListener("DOMContentLoaded", () => {
        const calcButtons = document.querySelectorAll(".calc-card button[onclick]");

        calcButtons.forEach((button) => {
            const clickDef = button.getAttribute("onclick") || "";
            const match = clickDef.match(/^(calc[A-Za-z0-9_]+)\(\)$/);
            if (!match) return;

            const fnName = match[1];
            if (!validationRules[fnName]) return;

            button.addEventListener("click", (event) => {
                const result = validateForFunction(fnName);
                if (result.valid) return;

                event.preventDefault();
                event.stopImmediatePropagation();
                if (result.firstInvalid) {
                    result.firstInvalid.focus();
                }
            }, true);
        });

        Object.values(validationRules)
            .flat()
            .forEach((rule) => {
                const input = getInput(rule.id);
                if (!input) return;
                input.addEventListener("input", () => {
                    const value = getNumber(input);
                    if (rule.validate(value)) {
                        clearFieldError(input);
                    }
                });
            });
    });
})();

// Quick actions layer: adds Example and Reset controls per calculator card.
(function setupCalculatorQuickActions() {
    const exampleByFunction = {
        calcEMI: { emiAmount: 500000, emiRate: 8, emiYears: 5 },
        calcSIP: { sipAmount: 5000, sipRate: 12, sipYears: 20, sipAmountB: 10000, sipRateB: 12, sipYearsB: 20 },
        calcLumpsum: { lumAmount: 100000, lumRate: 12, lumYears: 10 },
        calcGoalPlanner: { goalTarget: 5000000, goalYears: 15, goalReturn: 12 },
        calcStepUpSIP: { stepSipAmount: 5000, stepSipIncrease: 10, stepSipRate: 12, stepSipYears: 20 },
        calcLoanEligibility: { loanInc: 90000, loanEmis: 15000, loanRate: 8.5, loanTenure: 20 },
        calcLoanPrepayment: { preLoanAmount: 3000000, preLoanRate: 8.2, preLoanYears: 20, preExtraPay: 5000 },
        calcCapitalGains: { cgBuyPrice: 1200, cgSellPrice: 1650, cgQty: 100, cgHold: 30 },
        calcNetWorth: { nwAssets: 8500000, nwLiabilities: 2300000 },
        calcEmergencyFund: { efExpense: 45000, efMonths: 6 },
        calcFD: { fdAmount: 100000, fdRate: 7, fdYears: 5 },
        calcRD: { rdAmount: 3000, rdRate: 7, rdMonths: 60 },
        calcROI: { roiCost: 100000, roiValue: 145000 },
        calcInflation: { infValue: 100000, infRate: 6, infYears: 10 },
        calcCAGR: { cagrStart: 100000, cagrEnd: 260000, cagrYears: 8 },
        calcRetirement: { retExpense: 45000, retYears: 25 },
        calcTax: { taxIncome: 1200000, taxDeduction: 150000 },
        calcSavings: { savIncome: 80000, savExpense: 50000 },
        calcExpense: { expDaily: 1200 }
    };

    function dispatchInput(input) {
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function applyExample(fnName, card) {
        const data = exampleByFunction[fnName];
        if (!data) return;

        Object.entries(data).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (!input || !card.contains(input)) return;
            input.value = String(value);
            dispatchInput(input);
        });
    }

    function clearCardUI(card) {
        const resultEl = card.querySelector(".calc-output[id]");
        if (resultEl) {
            resultEl.innerHTML = "";
            resultEl.dataset.rawResult = "";
            resultEl.classList.remove("result-error", "result-show");

            document.dispatchEvent(new CustomEvent("calculator:result-updated", {
                detail: { resultId: resultEl.id, rawText: "", isError: true }
            }));
        }

        card.querySelectorAll(".calc-insight").forEach((el) => {
            el.classList.remove("is-visible");
            el.innerHTML = "";
        });

        card.querySelectorAll(".chart-wrap").forEach((wrap) => {
            wrap.classList.remove("is-visible");
            const canvas = wrap.querySelector("canvas");
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        });

        const compareWrap = card.querySelector("#sipCompareResultWrap");
        if (compareWrap) compareWrap.classList.remove("is-visible");
        const compareResults = card.querySelector("#sipCompareResults");
        if (compareResults) compareResults.innerHTML = "";

        const saveBtn = card.querySelector(".save-calc-btn");
        if (saveBtn) saveBtn.disabled = true;
    }

    function resetCard(card) {
        card.querySelectorAll("input").forEach((input) => {
            if (input.type === "number") {
                input.value = "";
                dispatchInput(input);
            }
            if (input.type === "checkbox") {
                input.checked = false;
                input.dispatchEvent(new Event("change", { bubbles: true }));
            }
        });

        card.querySelectorAll(".input-error-msg").forEach((msg) => {
            msg.textContent = "";
        });
        card.querySelectorAll(".input-invalid").forEach((el) => {
            el.classList.remove("input-invalid");
        });

        clearCardUI(card);
    }

    document.addEventListener("DOMContentLoaded", () => {
        const calcButtons = document.querySelectorAll(".calc-card button[onclick]");

        calcButtons.forEach((calcButton) => {
            const clickDef = calcButton.getAttribute("onclick") || "";
            const match = clickDef.match(/^(calc[A-Za-z0-9_]+)\(\)$/);
            if (!match) return;

            const fnName = match[1];
            const card = calcButton.closest(".calc-card");
            if (!card || card.querySelector(".quick-actions-row")) return;

            const row = document.createElement("div");
            row.className = "quick-actions-row";

            const exampleBtn = document.createElement("button");
            exampleBtn.type = "button";
            exampleBtn.className = "quick-btn quick-btn-example";
            exampleBtn.textContent = "Example";
            exampleBtn.addEventListener("click", () => applyExample(fnName, card));

            const resetBtn = document.createElement("button");
            resetBtn.type = "button";
            resetBtn.className = "quick-btn quick-btn-reset";
            resetBtn.textContent = "Reset";
            resetBtn.addEventListener("click", () => resetCard(card));

            row.appendChild(exampleBtn);
            row.appendChild(resetBtn);
            calcButton.insertAdjacentElement("afterend", row);
        });
    });
})();

// SIP compare mode: compares Scenario A vs B while reusing existing calcSIP function.
(function setupSIPCompareMode() {
    let compareChart = null;

    function parseRs(text) {
        if (!text) return NaN;
        const match = text.match(/Rs\s*([\d,]+(?:\.\d+)?)/i);
        return match ? Number(match[1].replace(/,/g, "")) : NaN;
    }

    function toINR(value) {
        return `\u20B9${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
    }

    function destroyCompareChart() {
        if (compareChart) {
            compareChart.destroy();
            compareChart = null;
        }
    }

    function toggleCompareUI(enabled) {
        const fields = document.getElementById("sipCompareFields");
        const wrap = document.getElementById("sipCompareResultWrap");
        if (fields) {
            fields.classList.toggle("is-visible", enabled);
            fields.setAttribute("aria-hidden", enabled ? "false" : "true");
        }
        if (wrap) {
            wrap.classList.toggle("is-visible", enabled);
        }
        if (!enabled) {
            destroyCompareChart();
        }
    }

    function readScenarioAResult() {
        const resultEl = document.getElementById("sipResult");
        const raw = (resultEl?.dataset?.rawResult || resultEl?.innerText || "").trim();
        return parseRs(raw);
    }

    function runScenarioBCalcUsingExistingFunction() {
        const sipAmount = document.getElementById("sipAmount");
        const sipRate = document.getElementById("sipRate");
        const sipYears = document.getElementById("sipYears");
        const sipResult = document.getElementById("sipResult");

        const bAmount = +document.getElementById("sipAmountB")?.value;
        const bRate = +document.getElementById("sipRateB")?.value;
        const bYears = +document.getElementById("sipYearsB")?.value;

        if (!(bAmount > 0) || !(bRate > 0) || !(bYears > 0)) {
            return NaN;
        }

        const aSnapshot = {
            amount: sipAmount.value,
            rate: sipRate.value,
            years: sipYears.value,
            raw: (sipResult.dataset.rawResult || sipResult.innerText || "").trim()
        };

        sipAmount.value = String(bAmount);
        sipRate.value = String(bRate);
        sipYears.value = String(bYears);

        window.calcSIP();
        const bRaw = (sipResult.innerText || "").trim();
        const bFuture = parseRs(bRaw);

        sipAmount.value = aSnapshot.amount;
        sipRate.value = aSnapshot.rate;
        sipYears.value = aSnapshot.years;
        window.calcSIP();
        sipResult.dataset.rawResult = (sipResult.innerText || aSnapshot.raw).trim();

        if (window.renderResultCardUI) {
            window.renderResultCardUI("sipResult");
        }
        if (window.toolsChartRenderers && typeof window.toolsChartRenderers.sip === "function") {
            window.toolsChartRenderers.sip();
        }

        return bFuture;
    }

    function renderCompareCards(aFuture, bFuture) {
        const out = document.getElementById("sipCompareResults");
        if (!out) return;

        const aMonthly = +document.getElementById("sipAmount")?.value || 0;
        const aYears = +document.getElementById("sipYears")?.value || 0;
        const bMonthly = +document.getElementById("sipAmountB")?.value || 0;
        const bYears = +document.getElementById("sipYearsB")?.value || 0;

        const aInvested = aMonthly * aYears * 12;
        const bInvested = bMonthly * bYears * 12;

        out.innerHTML = `
            <div class="compare-mini-card">
                <div class="compare-mini-label">Scenario A</div>
                <div class="compare-mini-value">${toINR(aFuture)}</div>
                <div class="compare-mini-row">Invested: ${toINR(aInvested)}</div>
                <div class="compare-mini-row">Returns: ${toINR(Math.max(0, aFuture - aInvested))}</div>
            </div>
            <div class="compare-mini-card">
                <div class="compare-mini-label">Scenario B</div>
                <div class="compare-mini-value">${toINR(bFuture)}</div>
                <div class="compare-mini-row">Invested: ${toINR(bInvested)}</div>
                <div class="compare-mini-row">Returns: ${toINR(Math.max(0, bFuture - bInvested))}</div>
            </div>
        `;
    }

    function renderCompareChart(aFuture, bFuture) {
        if (!window.Chart) return;

        const canvas = document.getElementById("sipCompareChart");
        if (!canvas) return;

        const aMonthly = +document.getElementById("sipAmount")?.value || 0;
        const aYears = +document.getElementById("sipYears")?.value || 0;
        const bMonthly = +document.getElementById("sipAmountB")?.value || 0;
        const bYears = +document.getElementById("sipYearsB")?.value || 0;

        const aInvested = aMonthly * aYears * 12;
        const bInvested = bMonthly * bYears * 12;

        destroyCompareChart();
        compareChart = new Chart(canvas.getContext("2d"), {
            type: "bar",
            data: {
                labels: ["Invested", "Future Value", "Returns"],
                datasets: [
                    {
                        label: "Scenario A",
                        data: [aInvested, aFuture, Math.max(0, aFuture - aInvested)],
                        backgroundColor: "rgba(37,99,235,0.85)"
                    },
                    {
                        label: "Scenario B",
                        data: [bInvested, bFuture, Math.max(0, bFuture - bInvested)],
                        backgroundColor: "rgba(22,163,74,0.85)"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } }
            }
        });
    }

    function renderCompareView() {
        const toggle = document.getElementById("sipCompareToggle");
        if (!toggle || !toggle.checked) return;

        const aFuture = readScenarioAResult();
        const bFuture = runScenarioBCalcUsingExistingFunction();

        if (!(aFuture > 0) || !(bFuture > 0)) {
            const out = document.getElementById("sipCompareResults");
            if (out) {
                out.innerHTML = "<div class=\"compare-mini-card\"><div class=\"compare-mini-row\">Enter valid Scenario B values to compare.</div></div>";
            }
            destroyCompareChart();
            return;
        }

        renderCompareCards(aFuture, bFuture);
        renderCompareChart(aFuture, bFuture);
    }

    document.addEventListener("DOMContentLoaded", () => {
        const toggle = document.getElementById("sipCompareToggle");
        const button = document.querySelector("button[onclick=\"calcSIP()\"]");
        const bInputs = ["sipAmountB", "sipRateB", "sipYearsB"].map((id) => document.getElementById(id));

        if (!toggle || !button) return;

        toggleCompareUI(toggle.checked);

        toggle.addEventListener("change", () => {
            toggleCompareUI(toggle.checked);
            if (toggle.checked) {
                renderCompareView();
            }
        });

        button.addEventListener("click", () => {
            setTimeout(() => {
                if (toggle.checked) {
                    renderCompareView();
                }
            }, 30);
        });

        bInputs.forEach((input) => {
            if (!input) return;
            input.addEventListener("input", () => {
                if (toggle.checked) {
                    renderCompareView();
                }
            });
        });
    });
})();

// Input hint layer: injects labels + tooltip help text without changing calculation behavior.
(function setupInputTooltips() {
    const tooltipByLabel = {
        "Loan Amount": "Total principal amount borrowed from the lender.",
        "Interest Rate": "Annual percentage charged on loan or earned on investment.",
        "Tenure": "Total duration of loan or investment.",
        "Monthly Investment": "Fixed amount invested every month.",
        "Return Rate": "Expected annual return.",
        "Years": "Total duration in years for this calculation.",
        "Investment": "Initial one-time amount you plan to invest.",
        "Principal": "Base amount on which returns or interest are calculated.",
        "Monthly Deposit": "Amount deposited each month in recurring mode.",
        "Months": "Total investment/loan duration in months.",
        "Investment Cost": "Total amount initially invested.",
        "Final Value": "Value of the investment at the end period.",
        "Today's Value": "Current value in present-day money.",
        "Inflation Rate": "Expected annual rise in prices over time.",
        "Start Value": "Investment value at the beginning.",
        "End Value": "Investment value at the end.",
        "Monthly Expense": "Average monthly spending amount.",
        "Years After Retirement": "Number of years your retirement corpus should support.",
        "Annual Income": "Total yearly income before taxes.",
        "Deductions": "Eligible deductions that reduce taxable income.",
        "Monthly Income": "Total income earned every month.",
        "Daily Expense": "Average amount spent per day."
    };

    function sanitizePlaceholder(text) {
        return (text || "").replace(/\s*\([^)]*\)\s*/g, "").trim();
    }

    function createFieldLabel(inputEl) {
        const baseLabel = sanitizePlaceholder(inputEl.getAttribute("placeholder"));
        if (!baseLabel) return null;

        const labelEl = document.createElement("label");
        labelEl.className = "field-label";
        labelEl.setAttribute("for", inputEl.id);
        labelEl.textContent = baseLabel;

        const hint = document.createElement("span");
        hint.className = "tooltip-help";
        hint.tabIndex = 0;
        hint.setAttribute("aria-label", `${baseLabel} help`);
        hint.textContent = "?";

        const tip = document.createElement("span");
        tip.className = "tooltip-text";
        tip.textContent = tooltipByLabel[baseLabel] || "Enter this value based on your current plan assumptions.";

        hint.appendChild(tip);
        labelEl.appendChild(hint);
        return labelEl;
    }

    document.addEventListener("DOMContentLoaded", () => {
        const inputs = document.querySelectorAll(".calc-card input");
        inputs.forEach((inputEl) => {
            if (!inputEl.id) return;

            const prev = inputEl.previousElementSibling;
            if (prev && prev.classList.contains("field-label") && prev.getAttribute("for") === inputEl.id) {
                return;
            }

            const label = createFieldLabel(inputEl);
            if (label) {
                inputEl.parentNode.insertBefore(label, inputEl);
            }
        });
    });
})();
