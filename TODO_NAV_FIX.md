# Navigation Fix Plan

## Reference: news.html Navigation Structure
```html
<header class="header" role="banner">
    <div class="nav container">
        <a href="/" class="logo" aria-label="FinEdu Home">
            <span class="logo-text"><span class="logo-blue">Fin</span><span class="logo-black">Edu</span></span>
        </a>
        <nav class="nav-links" aria-label="Main Navigation">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/pages/screener.html">Screener</a></li>
                <li><a href="/pages/tools.html">Tools</a></li>
                <li><a href="/pages/courses.html">Courses</a></li>
                <li><a href="/pages/learning.html">Learning</a></li>
                <li><a href="/pages/seminars.html">Seminars</a></li>
                <li><a href="/pages/news.html" class="active">News</a></li>
            </ul>
        </nav>
    </div>
</header>
```

## Pages to Fix

### 1. screener.html
- [ ] Fix logo href from "../index.html" to "/"
- [ ] Add missing "Seminars" link in nav

### 2. learning.html
- [ ] Wrap the `<ul>` inside proper `<nav class="nav-links" aria-label="Main Navigation">`

### 3. seminars.html
- [ ] Add missing closing `</div>` before `</header>`

### 4. learning-intermediate.html
- [ ] Wrap the `<ul>` inside proper `<nav class="nav-links" aria-label="Main Navigation">`

### 5. learning-advanced.html
- [ ] Fix broken header - add missing `</nav>` closing tag
- [ ] Wrap the `<ul>` inside proper `<nav class="nav-links" aria-label="Main Navigation">`

### 6. stock.html
- [ ] Change active class from "Screener" to "News"

### 7. live.html
- [ ] Move `<div class="nav-cta-placeholder">` outside the nav container

## Files to Edit
1. frontend/pages/screener.html
2. frontend/pages/learning.html
3. frontend/pages/seminars.html
4. frontend/pages/learning-intermediate.html
5. frontend/pages/learning-advanced.html
6. frontend/pages/stock.html
7. frontend/pages/live.html

