# Screener Redesign Plan - TradingView Style

## Information Gathered

### Current Project Structure
- **Frontend**: HTML/CSS/JS pages in `frontend/pages/`
- **Backend**: Express server with APIs at `backend/server.js`
- **Styling**: `frontend/style.css` (main) + page-specific CSS

### Current Screener Features
- Basic stock screener with filters (market cap, PE, ROE, sector, price)
- Stock search using Tom Select
- Results table with stock data
- TradingView charts for NIFTY 50, SENSEX, BANKNIFTY, USD/INR

### Backend APIs Available
- `/api/stocks` - NSE stock list
- `/api/screener` - Screener with filters
- `/api/stock/:symbol` - Individual stock details
- `/api/news` - News feed

### APIs Needed to Add
- `/api/indices` - NSE indices data
- `/api/market/gainers` - Top gainers
- `/api/market/losers` - Top losers  
- `/api/market/most-active` - Most active by volume
- `/api/market/most-volatile` - Most volatile stocks
- `/api/market/trending` - Community trending stocks

---

## Plan

### Phase 1: Backend API Extensions

1. **Add new API endpoints** to `backend/server.js`:
   - `/api/indices` - Fetch NSE indices (NIFTY 50, SENSEX, etc.)
   - `/api/market/gainers` - Top gainers from NSE
   - `/api/market/losers` - Top losers from NSE
   - `/api/market/most-active` - Most active securities
   - `/api/market/most-volatile` - Most volatile stocks

### Phase 2: Frontend HTML Structure

2. **Create new screener.html** with sections:
   - Navbar (existing, keep as is)
   - Ticker Tape (TradingView widget)
   - Country selector header
   - Major Indices Cards (horizontal scroll)
   - Market Overview (TradingView widget)
   - Category tabs
   - Community Trends Cards
   - Data Tables (Gainers, Losers, Volume, Volatile)
   - TradingView Stock Screener Widget
   - Advanced Chart section
   - Footer

### Phase 3: Frontend CSS Styling

3. **Create new screener.css**:
   - TradingView-inspired dark/light theme
   - Compact card-based layout
   - Responsive grid system
   - Table styling with color coding
   - Smooth animations

### Phase 4: Frontend JavaScript

4. **Create new screener.js**:
   - Fetch data from new APIs
   - Render indices cards dynamically
   - Render data tables (gainers, losers, etc.)
   - Initialize TradingView widgets
   - Auto-refresh data periodically
   - Tab switching logic

---

## Dependent Files to Edit

1. **backend/server.js** - Add new API endpoints
2. **frontend/pages/screener.html** - Completely redesign
3. **frontend/styles/pages/screener.css** - New styling
4. **frontend/pages/screener.js** - New functionality

---

## Implementation Steps

### Step 1: Add Backend APIs
- Add `/api/indices` endpoint
- Add `/api/market/gainers` endpoint
- Add `/api/market/losers` endpoint
- Add `/api/market/most-active` endpoint
- Add `/api/market/most-volatile` endpoint

### Step 2: Create New HTML Structure
- Ticker Tape widget section
- Indices cards section
- Market tabs section
- Community trends section
- Data tables section
- TradingView widgets integration

### Step 3: Add CSS Styling
- Dashboard grid layout
- Card styles (rounded, shadows)
- Table styles with color coding
- Responsive breakpoints

### Step 4: Add JavaScript Functionality
- API data fetching
- Dynamic table rendering
- Widget initialization
- Auto-refresh logic

---

## Followup Steps

1. Test all new API endpoints
2. Verify TradingView widgets load correctly
3. Test responsive behavior
4. Optimize for performance (lazy loading)
5. Test auto-refresh functionality

---

## TradingView Widgets to Use

1. **Ticker Tape Widget** - Live scrolling tickers
2. **Market Overview Widget** - Market summary
3. **Stock Screener Widget** - Advanced filtering
4. **Advanced Chart Widget** - Detailed charts

---

## NSE API Integration

Use existing `stock-nse-india` package or create proxy endpoints:
- Indices: `nse.getEquityStockIndices()`
- Gainers: `nse.getLiveAnalysisVariations({ index: 'gainers' })`
- Losers: `nse.getLiveAnalysisVariations({ index: 'losers' })`
- Most Active: `nse.getMostActiveSecurities()`

