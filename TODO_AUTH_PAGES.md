# TODO: Authentication UI Updates

## Task: 
- Only home page should have "Get Started" button enabled
- When user clicks on any link, login should be prompted
- After successful login, the button name should change to "Welcome {username}" on home page
- On other pages, remove "Get Started" and keep the space empty

## Steps to Complete:
1. [x] Understand current implementation
2. [x] Update frontend/app.js - Modify updateHomeWelcomeCTA() function
3. [x] Update screener.html - Added app.js (script will hide button on non-home pages)
4. [x] Update tools.html - Added app.js
5. [x] Update learning.html - Already has app.js
6. [x] Update news.html - Added app.js
7. [x] Update stock.html - Added app.js
8. [x] Update learning-intermediate.html - Already has app.js
9. [x] Update seminars.html - Already has app.js
10. [x] courses.html, learning-advanced.html, live.html - Already have placeholder

## Implementation Summary:
- Updated `app.js` with enhanced `updateHomeWelcomeCTA()` function that:
  - On home page: Shows "Get Started" for unauthenticated users
  - On home page (logged in): Shows "Welcome, {name} ✨"
  - On other pages (unauthenticated): Hides the button completely
  - On other pages (logged in): Shows "Welcome, {name} ✨"

- Added `app.js` to pages that were missing it:
  - screener.html
  - tools.html
  - news.html
  - stock.html

## Notes:
- The requireAuthForProtectedLinks() function already handles prompting login when clicking on any link
- The enforceHomeOnLaunchAndRefresh() function redirects non-homepage direct access back to home
- Pages already using nav-cta-placeholder: courses.html, learning-advanced.html, live.html

