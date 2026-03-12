const rawCourses = [
    { title: "Financial Analysis Fundamentals", category: "Analysis", duration: "4 Weeks", level: "Beginner", price: "Free", url: "https://www.upgrad.com/free-courses/mba-and-management/financial-analysis-course-free/", createdAt: "2026-02-14", popularity: 95 },
    { title: "Introduction to Finance", category: "Core Finance", duration: "3 Weeks", level: "Beginner", price: "Free", url: "https://www.upgrad.com/free-courses/finance/introduction-to-finance/", createdAt: "2026-02-11", popularity: 89 },
    { title: "Corporate Finance Essentials", category: "Corporate", duration: "6 Weeks", level: "Intermediate", price: "Paid", url: "https://www.coursera.org/learn/corporate-finance", createdAt: "2026-02-06", popularity: 84 },
    { title: "Investment Foundations", category: "Investing", duration: "8 Weeks", level: "Beginner", price: "Free", url: "https://www.cfainstitute.org/en/programs/investment-foundations", createdAt: "2026-02-03", popularity: 97 },
    { title: "Tax Planning for Professionals", category: "Tax", duration: "5 Weeks", level: "Intermediate", price: "Paid", url: "https://www.coursera.org/search?query=tax%20planning", createdAt: "2026-01-30", popularity: 78 },
    { title: "Risk Management Basics", category: "Risk", duration: "4 Weeks", level: "Beginner", price: "Free", url: "https://www.coursera.org/search?query=risk%20management", createdAt: "2026-01-26", popularity: 81 },
    { title: "Financial Modeling with Excel", category: "Modeling", duration: "7 Weeks", level: "Intermediate", price: "Paid", url: "https://corporatefinanceinstitute.com/course/financial-modeling-valuation-analyst-fmva-program/", createdAt: "2026-01-23", popularity: 88 },
    { title: "Mutual Funds and SIP Strategy", category: "Investing", duration: "4 Weeks", level: "Beginner", price: "Free", url: "https://www.nism.ac.in/long-term-programs/", createdAt: "2026-01-21", popularity: 93 },
    { title: "Stock Market for New Investors", category: "Markets", duration: "5 Weeks", level: "Beginner", price: "Free", url: "https://www.nseindia.com/learn", createdAt: "2026-01-18", popularity: 92 },
    { title: "Portfolio Allocation Framework", category: "Portfolio", duration: "6 Weeks", level: "Intermediate", price: "Paid", url: "https://www.coursera.org/search?query=portfolio%20management", createdAt: "2026-01-15", popularity: 85 },
    { title: "Retirement Planning System", category: "Planning", duration: "4 Weeks", level: "Intermediate", price: "Paid", url: "https://www.npscra.nsdl.co.in/", createdAt: "2026-01-12", popularity: 79 },
    { title: "Behavioral Finance Essentials", category: "Psychology", duration: "3 Weeks", level: "Intermediate", price: "Paid", url: "https://www.coursera.org/search?query=behavioral%20finance", createdAt: "2026-01-09", popularity: 74 },
    { title: "Debt Management and EMI Planning", category: "Personal Finance", duration: "3 Weeks", level: "Beginner", price: "Free", url: "https://www.rbi.org.in/financialeducation/", createdAt: "2026-01-06", popularity: 83 },
    { title: "Fundamental Analysis Toolkit", category: "Analysis", duration: "6 Weeks", level: "Intermediate", price: "Paid", url: "https://www.coursera.org/search?query=fundamental%20analysis", createdAt: "2026-01-04", popularity: 86 },
    { title: "Technical Analysis for Practical Trading", category: "Trading", duration: "6 Weeks", level: "Intermediate", price: "Paid", url: "https://www.nseindia.com/learn/courses", createdAt: "2025-12-30", popularity: 90 },
    { title: "Insurance in Financial Planning", category: "Protection", duration: "2 Weeks", level: "Beginner", price: "Free", url: "https://www.irdai.gov.in/consumer-education", createdAt: "2025-12-27", popularity: 72 },
    { title: "NPS, EPF and Long-Term Security", category: "Retirement", duration: "4 Weeks", level: "Beginner", price: "Free", url: "https://www.epfindia.gov.in/site_en/index.php", createdAt: "2025-12-24", popularity: 70 },
    { title: "Macro Economics for Investors", category: "Macro", duration: "5 Weeks", level: "Advanced", price: "Paid", url: "https://www.coursera.org/search?query=macroeconomics", createdAt: "2025-12-21", popularity: 76 },
    { title: "ETFs and Index Investing", category: "Investing", duration: "3 Weeks", level: "Beginner", price: "Free", url: "https://www.nseindia.com/market-data/exchange-traded-funds-etf", createdAt: "2025-12-19", popularity: 87 },
    { title: "Advanced Portfolio Management", category: "Portfolio", duration: "8 Weeks", level: "Advanced", price: "Paid", url: "https://www.coursera.org/specializations/investment-management", createdAt: "2025-12-15", popularity: 82 },
    { title: "Valuation Deep Dive", category: "Valuation", duration: "6 Weeks", level: "Advanced", price: "Paid", url: "https://www.coursera.org/search?query=valuation", createdAt: "2025-12-12", popularity: 68 },
    { title: "Fixed Income and Bond Markets", category: "Fixed Income", duration: "5 Weeks", level: "Intermediate", price: "Paid", url: "https://www.nseindia.com/learn/courses", createdAt: "2025-12-08", popularity: 66 },
    { title: "Commodities and Currency Basics", category: "Markets", duration: "3 Weeks", level: "Intermediate", price: "Paid", url: "https://www.nseindia.com/learn/courses", createdAt: "2025-12-05", popularity: 64 },
    { title: "Family Budgeting Masterclass", category: "Personal Finance", duration: "2 Weeks", level: "Beginner", price: "Free", url: "https://www.khanacademy.org/college-careers-more/personal-finance", createdAt: "2025-12-02", popularity: 73 }
];

const MAX_COURSES = 19;
const MAX_FEATURED_COURSES = 3;
const MAX_RECOMMENDED_COURSES = 3;
const coursesGrid = document.getElementById("coursesGrid");
const featuredCoursesGrid = document.getElementById("featuredCoursesGrid");
const recommendedCoursesGrid = document.getElementById("recommendedCoursesGrid");
const coursesCountLabel = document.getElementById("courses-count-label");
const recommendedCoursesLabel = document.getElementById("recommended-courses-label");
const categoryPills = Array.from(document.querySelectorAll(".courses-category-pill"));
const courseSearchInput = document.getElementById("course-search-input");
const levelFilterSelect = document.getElementById("courses-level-filter");
const priceFilterSelect = document.getElementById("courses-price-filter");
const durationFilterSelect = document.getElementById("courses-duration-filter");
const clearFiltersButton = document.getElementById("courses-clear-filters");

const CATEGORY_GROUPS = {
    "All": [],
    "Investing": ["Investing", "Portfolio", "Markets", "Fixed Income"],
    "Personal Finance": ["Personal Finance", "Planning", "Protection", "Retirement"],
    "Corporate Finance": ["Corporate", "Core Finance", "Modeling", "Valuation"],
    "Trading": ["Trading"],
    "Tax": ["Tax"],
    "Risk": ["Risk"],
    "Macro": ["Macro"],
    "Analysis": ["Analysis", "Psychology"]
};

let activeCategory = "All";
let searchQuery = "";
let activeLevelFilter = "all";
let activePriceFilter = "all";
let activeDurationFilter = "all";

function sortByNewestAndPopularity(courses) {
    return courses.sort((a, b) => {
        const dateDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (dateDiff !== 0) return dateDiff;
        return b.popularity - a.popularity;
    });
}

function filterByCategory(courses, category) {
    if (category === "All") {
        return courses;
    }

    const allowedCategories = CATEGORY_GROUPS[category] || [];
    return courses.filter((course) => allowedCategories.includes(course.category));
}

function filterBySearch(courses, query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
        return courses;
    }

    return courses.filter((course) => {
        const title = course.title.toLowerCase();
        const tag = course.category.toLowerCase();
        return title.includes(normalizedQuery) || tag.includes(normalizedQuery);
    });
}

function getDurationWeeks(durationLabel) {
    const matched = durationLabel.match(/\d+/);
    if (!matched) {
        return 0;
    }
    return Number(matched[0]);
}

function matchesDurationFilter(course, durationFilter) {
    if (durationFilter === "all") {
        return true;
    }

    const weeks = getDurationWeeks(course.duration);

    if (durationFilter === "lt4") {
        return weeks < 4;
    }

    if (durationFilter === "4to6") {
        return weeks >= 4 && weeks <= 6;
    }

    if (durationFilter === "6plus") {
        return weeks >= 6;
    }

    return true;
}

function filterByAdditionalControls(courses) {
    return courses.filter((course) => {
        const levelPass = activeLevelFilter === "all" || course.level === activeLevelFilter;
        const pricePass = activePriceFilter === "all" || course.price === activePriceFilter;
        const durationPass = matchesDurationFilter(course, activeDurationFilter);
        return levelPass && pricePass && durationPass;
    });
}

function getVisibleCourses() {
    const sorted = sortByNewestAndPopularity([...rawCourses]);
    const categoryFiltered = filterByCategory(sorted, activeCategory);
    const searchFiltered = filterBySearch(categoryFiltered, searchQuery);
    const filtered = filterByAdditionalControls(searchFiltered);
    return filtered.slice(0, MAX_COURSES);
}

function buildSummary(course) {
    return `Build practical ${course.category.toLowerCase()} skills in ${course.duration.toLowerCase()} with ${course.level.toLowerCase()}-friendly lessons and execution examples.`;
}

function getCourseRating(course) {
    const rating = 4 + (course.popularity / 100);
    return Math.min(5, rating).toFixed(1);
}

function getCourseReviews(course) {
    return Math.max(60, Math.round(course.popularity * 1.8));
}

function getCourseLessons(course) {
    const weeks = getDurationWeeks(course.duration);
    const lessons = weeks * 3;
    return Math.max(6, lessons);
}

function getLevelBadgeClass(level) {
    if (level === "Beginner") return "course-level-badge level-beginner";
    if (level === "Intermediate") return "course-level-badge level-intermediate";
    if (level === "Advanced") return "course-level-badge level-advanced";
    return "course-level-badge";
}

function getCourseAccentClass(category) {
    if (["Investing", "Portfolio", "Markets", "Fixed Income"].includes(category)) return "course-accent-investing";
    if (["Corporate", "Core Finance", "Modeling", "Valuation", "Analysis"].includes(category)) return "course-accent-corporate";
    if (["Personal Finance", "Planning", "Protection", "Retirement"].includes(category)) return "course-accent-personal";
    if (["Trading"].includes(category)) return "course-accent-trading";
    if (["Tax"].includes(category)) return "course-accent-tax";
    if (["Risk", "Psychology", "Macro"].includes(category)) return "course-accent-risk";
    return "course-accent-default";
}

function getCourseImageUrl(course) {
    const imageByCategory = {
        "Investing": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        "Portfolio": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "Markets": "https://images.unsplash.com/photo-1642543348745-2b6f6228d7d2?auto=format&fit=crop&w=1200&q=80",
        "Fixed Income": "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&q=80",
        "Corporate": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
        "Core Finance": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80",
        "Modeling": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
        "Valuation": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        "Analysis": "https://images.unsplash.com/photo-1551281044-8c6a4f7f6f4f?auto=format&fit=crop&w=1200&q=80",
        "Personal Finance": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
        "Planning": "https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=1200&q=80",
        "Protection": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
        "Retirement": "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
        "Trading": "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?auto=format&fit=crop&w=1200&q=80",
        "Tax": "https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?auto=format&fit=crop&w=1200&q=80",
        "Risk": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        "Psychology": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
        "Macro": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80"
    };

    return imageByCategory[course.category] || "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80";
}

function getCourseCategoryIcon(category) {
    if (["Investing", "Portfolio", "Markets", "Fixed Income"].includes(category)) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16l5-5 4 4 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 10V4h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    if (["Tax"].includes(category)) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    if (["Trading"].includes(category)) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 14l4-4 3 3 5-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 9h10M7 13h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
}

function getMetaIcon(type) {
    if (type === "duration") {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    if (type === "level") {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16M7 15l3-3 3 2 4-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M4 7h10a4 4 0 0 1 0 8H7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function buildCourseCard(course, options = {}) {
    const { featured = false } = options;
    const rating = getCourseRating(course);
    const reviews = getCourseReviews(course);
    const lessons = getCourseLessons(course);
    const levelBadgeClass = getLevelBadgeClass(course.level);
    const accentClass = getCourseAccentClass(course.category);
    const courseImageUrl = getCourseImageUrl(course);
    const categoryIcon = getCourseCategoryIcon(course.category);

    return `
        <article class="course-card-v2 ${accentClass}${featured ? " course-card-featured" : ""}">
            <div class="course-card-media">
                <img src="${courseImageUrl}" alt="${course.title} course preview" loading="lazy" referrerpolicy="no-referrer">
            </div>
            <div class="course-card-head">
                <span class="course-category-tag">${course.category}</span>
                <span class="course-title-icon" aria-hidden="true">${categoryIcon}</span>
            </div>
            <div>
                <h3>${course.title}</h3>
                <p class="course-summary-v2">${buildSummary(course)}</p>
            </div>
            <div class="course-learning-meta" aria-label="Learning details">
                <span class="course-rating">${`\u2B50`} ${rating} (${reviews} reviews)</span>
                <span class="course-lessons">Lessons: ${lessons}</span>
            </div>
            <div class="course-meta-row">
                <span><span class="course-meta-icon" aria-hidden="true">${getMetaIcon("duration")}</span>Duration: ${course.duration}</span>
                <span><span class="course-meta-icon" aria-hidden="true">${getMetaIcon("level")}</span>Level: <span class="${levelBadgeClass}">${course.level}</span></span>
                <span><span class="course-meta-icon" aria-hidden="true">${getMetaIcon("price")}</span>Price: ${course.price}</span>
            </div>
            <a class="btn small course-btn-v2" href="${course.url}" target="_blank" rel="noopener noreferrer">View Details</a>
        </article>
    `;
}

function getFeaturedCourses() {
    const sorted = sortByNewestAndPopularity([...rawCourses]);
    return sorted.slice(0, MAX_FEATURED_COURSES);
}

function getRecommendedCourses() {
    const sorted = sortByNewestAndPopularity([...rawCourses]);
    const activeCategoryGroup = CATEGORY_GROUPS[activeCategory] || [];

    if (activeCategory !== "All" && activeCategoryGroup.length > 0) {
        const categoryRecommendations = sorted.filter((course) => activeCategoryGroup.includes(course.category));
        return categoryRecommendations.slice(0, MAX_RECOMMENDED_COURSES);
    }

    const visibleCategories = new Set(getVisibleCourses().map((course) => course.category));
    const fallbackRecommendations = sorted.filter((course) => visibleCategories.has(course.category));
    return fallbackRecommendations.slice(0, MAX_RECOMMENDED_COURSES);
}

function renderFeaturedCourses() {
    if (!featuredCoursesGrid) {
        return;
    }

    const featuredCourses = getFeaturedCourses();
    featuredCoursesGrid.innerHTML = featuredCourses
        .map((course) => buildCourseCard(course, { featured: true }))
        .join("");
}

function renderRecommendedCourses() {
    if (!recommendedCoursesGrid) {
        return;
    }

    const recommendedCourses = getRecommendedCourses();
    recommendedCoursesGrid.innerHTML = recommendedCourses
        .map((course) => buildCourseCard(course))
        .join("");

    if (recommendedCoursesLabel) {
        recommendedCoursesLabel.textContent = activeCategory === "All"
            ? "Suggestions based on your selected category"
            : `Suggestions for ${activeCategory}`;
    }
}

function renderCourses() {
    const visibleCourses = getVisibleCourses();
    coursesCountLabel.textContent = `Showing ${visibleCourses.length} ${activeCategory === "All" ? "featured" : activeCategory} courses`;

    coursesGrid.innerHTML = visibleCourses
        .map((course) => buildCourseCard(course))
        .join("");

    renderRecommendedCourses();
}

function updateActivePill() {
    categoryPills.forEach((pill) => {
        const isActive = pill.dataset.category === activeCategory;
        pill.classList.toggle("is-active", isActive);
        pill.setAttribute("aria-pressed", String(isActive));
    });
}

function bindCategoryFilters() {
    categoryPills.forEach((pill) => {
        pill.addEventListener("click", () => {
            const selectedCategory = pill.dataset.category || "All";
            if (selectedCategory === activeCategory) {
                return;
            }

            activeCategory = selectedCategory;
            updateActivePill();
            renderCourses();
        });
    });
}

function bindSearchFilter() {
    if (!courseSearchInput) {
        return;
    }

    courseSearchInput.addEventListener("input", (event) => {
        searchQuery = event.target.value || "";
        renderCourses();
    });
}

function bindExtraFilters() {
    if (levelFilterSelect) {
        levelFilterSelect.addEventListener("change", (event) => {
            activeLevelFilter = event.target.value;
            renderCourses();
        });
    }

    if (priceFilterSelect) {
        priceFilterSelect.addEventListener("change", (event) => {
            activePriceFilter = event.target.value;
            renderCourses();
        });
    }

    if (durationFilterSelect) {
        durationFilterSelect.addEventListener("change", (event) => {
            activeDurationFilter = event.target.value;
            renderCourses();
        });
    }

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener("click", () => {
            activeCategory = "All";
            searchQuery = "";
            activeLevelFilter = "all";
            activePriceFilter = "all";
            activeDurationFilter = "all";

            if (courseSearchInput) {
                courseSearchInput.value = "";
            }
            if (levelFilterSelect) {
                levelFilterSelect.value = "all";
            }
            if (priceFilterSelect) {
                priceFilterSelect.value = "all";
            }
            if (durationFilterSelect) {
                durationFilterSelect.value = "all";
            }

            updateActivePill();
            renderCourses();
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    bindCategoryFilters();
    bindSearchFilter();
    bindExtraFilters();
    updateActivePill();
    renderFeaturedCourses();
    renderCourses();
});


