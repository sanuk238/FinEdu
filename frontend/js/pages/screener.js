// FinEdu Screener - TradingView Style
// Dynamic market data for Indian Stock Market

(function() {
    'use strict';

    const BASE_API_URL = (
        window.BASE_API_URL
        || window.__ENV__?.BASE_API_URL
        || ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? "http://localhost:5000"
            : "https://finedu-api.onrender.com")
    ).replace(/\/$/, "");
    const REFRESH_INTERVAL = 60000;
    let refreshTimers = [];

    const elements = {
        indicesGrid: document.getElementById('indicesGrid'),
        sectorHeatmapGrid: document.getElementById('sectorHeatmapGrid'),
        sectorPerformanceSection: document.getElementById('sectorPerformanceSection'),
        gainersTable: document.getElementById('gainersTable'),
        losersTable: document.getElementById('losersTable'),
        volumeTable: document.getElementById('volumeTable'),
        volatileTable: document.getElementById('volatileTable'),
        trendingList: document.getElementById('trendingList'),
        marketStatusDot: document.getElementById('marketStatusDot'),
        marketStatusText: document.getElementById('marketStatusText'),
        tablesGrid: document.getElementById('tablesGrid'),
        etfSection: document.getElementById('etfSection'),
        etfCardsGrid: document.getElementById('etfCardsGrid'),
        etfTable: document.getElementById('etfTable'),
        stockSearchInput: document.getElementById('stockSearchInput'),
        searchDropdown: document.getElementById('searchDropdown'),
        dropdownContent: document.getElementById('dropdownContent')
    };

    let currentCategory = 'indices';
    let etfData = [];
    let stocksData = []; // Store stock data for filtering
    let etfSort = { key: 'symbol', direction: 'asc' };
    let etfChart = null;
    let etfChartResizeHandler = null;
    let etfRefreshTimer = null;
    const ETF_REFRESH_INTERVAL = 60000; // 60 seconds
    let searchTimeout = null; // For debouncing search requests

    // Table sorting state
    let tableSortStates = {
        gainersTable: { key: null, direction: 'asc' },
        losersTable: { key: null, direction: 'asc' },
        volumeTable: { key: null, direction: 'asc' },
        volatileTable: { key: null, direction: 'asc' }
    };

    // Store original table data for filtering/sorting
    let tableDataStore = {
        gainersTable: [],
        losersTable: [],
        volumeTable: [],
        volatileTable: []
    };

    // Watchlist state
    let watchlist = new Set();
    const sectorPerformanceData = [
        { name: 'Banking', changePercent: 1.24 },
        { name: 'IT', changePercent: -0.82 },
        { name: 'Auto', changePercent: 0.48 },
        { name: 'Pharma', changePercent: 0.06 },
        { name: 'FMCG', changePercent: -0.14 },
        { name: 'Energy', changePercent: 1.08 },
        { name: 'Metals', changePercent: -1.32 }
    ];
    const fallbackSearchData = [
        { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', type: 'Stock' },
        { symbol: 'TCS', name: 'Tata Consultancy Services', type: 'Stock' },
        { symbol: 'INFY', name: 'Infosys Ltd', type: 'Stock' },
        { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', type: 'Stock' },
        { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', type: 'Stock' },
        { symbol: 'NIFTY50', name: 'Nifty 50', type: 'Index' },
        { symbol: 'SENSEX', name: 'BSE Sensex', type: 'Index' },
        { symbol: 'NIFTYBANK', name: 'Nifty Bank', type: 'Index' },
        { symbol: 'NIFTYIT', name: 'Nifty IT', type: 'Index' },
        { symbol: 'NIFTYFINSRV', name: 'Nifty Financial Services', type: 'Index' }
    ];

    function formatNumber(num, decimals = 2) {
        if (num === null || num === undefined || isNaN(num)) return '--';
        return Number(num).toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function formatVolume(num) {
        if (!num || isNaN(num)) return '--';
        if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
        else if (num >= 100000) return (num / 100000).toFixed(2) + ' L';
        else if (num >= 1000) return (num / 1000).toFixed(2) + ' K';
        return num.toString();
    }

    function getChangeClass(change) {
        if (change > 0) return 'positive';
        if (change < 0) return 'negative';
        return '';
    }

    function getInitials(name) {
        if (!name) return '??';
        const words = name.split(' ');
        if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    }

    function getAutocompleteSource() {
        if (stocksData && stocksData.length > 0) {
            return stocksData.map(stock => ({
                symbol: stock.symbol,
                name: stock.name || stock.symbol,
                type: 'Stock',
                price: stock.price,
                changePercent: stock.changePercent,
                volume: stock.volume
            }));
        }

        return fallbackSearchData.filter(item => item.type === 'Stock');
    }

    function getAutocompleteSuggestions(query) {
        const normalizedQuery = query.toLowerCase().trim();
        if (!normalizedQuery) return [];

        const uniqueSuggestions = new Map();

        getAutocompleteSource().forEach((item) => {
            const name = (item.name || '').toLowerCase();
            const symbol = (item.symbol || '').toLowerCase();

            if (name.includes(normalizedQuery) || symbol.includes(normalizedQuery)) {
                uniqueSuggestions.set(item.symbol, {
                    symbol: item.symbol,
                    name: item.name || item.symbol,
                    type: 'Stock',
                    price: item.price,
                    changePercent: item.changePercent,
                    volume: item.volume
                });
            }
        });

        return Array.from(uniqueSuggestions.values()).slice(0, 8);
    }

    function getSectorPerformanceClass(changePercent) {
        if (changePercent > 0.2) return 'positive';
        if (changePercent < -0.2) return 'negative';
        return 'neutral';
    }

    function renderSectorPerformance() {
        if (!elements.sectorHeatmapGrid) return;

        const html = sectorPerformanceData.map((sector) => {
            const performanceClass = getSectorPerformanceClass(sector.changePercent);
            const changePrefix = sector.changePercent >= 0 ? '+' : '';

            return `
                <article class="sector-heatmap-card ${performanceClass}">
                    <div class="sector-name">${sector.name}</div>
                    <div class="sector-change">${changePrefix}${formatNumber(sector.changePercent)}%</div>
                </article>
            `;
        }).join('');

        elements.sectorHeatmapGrid.innerHTML = html;
    }

    // Handle stock click - update iframe
    function handleStockClick(symbol) {
        if (window.updateStockFrame) {
            window.updateStockFrame(symbol);
        }
        // Navigate to stock detail page with a relative path so it works in local and hosted setups.
        window.location.href = './stock.html?symbol=' + encodeURIComponent(symbol);
    }

    window.updateStockFrame = function(symbol) {
        const frame = document.getElementById('stockFrame');
        if (frame && symbol) {
            frame.src = './stock.html?symbol=' + encodeURIComponent(symbol);
        }
    };

    function checkMarketStatus() {
        const now = new Date();
        const day = now.getDay();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const time = hours * 60 + minutes;
        const isWeekday = day >= 1 && day <= 5;
        const isMarketHours = time >= 555 && time <= 930;
        const isOpen = isWeekday && isMarketHours;

        if (elements.marketStatusDot) {
            elements.marketStatusDot.classList.toggle('closed', !isOpen);
        }
        if (elements.marketStatusText) {
            elements.marketStatusText.textContent = isOpen ? 'Market Open' : 'Market Closed';
        }
        return isOpen;
    }

    async function fetchAPI(endpoint) {
        try {
            const response = await fetch(`${BASE_API_URL}${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return null;
        }
    }

    function renderIndices(indices) {
        if (!indices || !indices.length) {
            renderIndicesFallback();
            return;
        }

        const indicesToShow = indices.slice(0, 3);
        const html = indicesToShow.map(index => {
            const changeClass = getChangeClass(index.changePercent);
            const changePrefix = index.changePercent >= 0 ? '+' : '';
            
            return `
                <div class="index-card" data-symbol="${index.symbol}">
                    <div class="index-card-info">
                        <h4>${index.name || index.symbol}</h4>
                        <div class="value">${formatNumber(index.value)}</div>
                    </div>
                    <div class="index-card-change">
                        <div class="change-value ${changeClass}">${changePrefix}${formatNumber(index.change)}</div>
                        <div class="change-percent ${changeClass}">${changePrefix}${formatNumber(index.changePercent)}%</div>
                    </div>
                </div>
            `;
        }).join('');

        if (elements.indicesGrid) {
            elements.indicesGrid.innerHTML = html;
            elements.indicesGrid.querySelectorAll('.index-card').forEach(card => {
                card.addEventListener('click', () => handleStockClick(card.dataset.symbol));
            });
        }
    }

    function renderIndicesFallback() {
        const fallbackData = [
            { name: 'NIFTY 50', symbol: 'NIFTY 50', value: 22850.00, change: 85.25, changePercent: 0.37 },
            { name: 'SENSEX', symbol: 'SENSEX', value: 75600.00, change: 156.80, changePercent: 0.21 },
            { name: 'NIFTY BANK', symbol: 'BANKNIFTY', value: 48500.00, change: 245.60, changePercent: 0.51 }
        ];
        renderIndices(fallbackData);
    }

    function createTableSkeletonRows(rowCount = 6) {
        return Array.from({ length: rowCount }, () => `
            <tr class="table-skeleton-row" aria-hidden="true">
                <td class="watchlist-cell">
                    <div class="table-skeleton skeleton table-skeleton-star"></div>
                </td>
                <td>
                    <div class="stock-cell">
                        <div class="table-skeleton skeleton table-skeleton-icon"></div>
                        <div class="table-skeleton-stack">
                            <div class="table-skeleton skeleton table-skeleton-name"></div>
                            <div class="table-skeleton skeleton table-skeleton-symbol"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="table-skeleton skeleton table-skeleton-price"></div>
                </td>
                <td>
                    <div class="table-skeleton skeleton table-skeleton-change"></div>
                </td>
                <td>
                    <div class="table-skeleton skeleton table-skeleton-volume"></div>
                </td>
            </tr>
        `).join('');
    }

    function renderTableSkeleton(tableId, rowCount = 6) {
        const table = document.getElementById(tableId);
        if (!table) return;

        table.innerHTML = createTableSkeletonRows(rowCount);
    }

    function renderTable(tableId, data, storeData = true) {
        const table = document.getElementById(tableId);
        if (!table) return;

        // Store original data if requested
        if (storeData && data) {
            tableDataStore[tableId] = [...data];
        }

        if (!data || !data.length) {
            table.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #6b7280;">No data available</td></tr>';
            return;
        }

        const html = data.slice(0, 8).map(stock => {
            const changeClass = getChangeClass(stock.changePercent);
            const changePrefix = stock.changePercent >= 0 ? '+' : '';
            const isInWatchlistFlag = isInWatchlist(stock.symbol);
            
            return `
                <tr data-symbol="${stock.symbol}">
                    <td class="watchlist-cell">
                        <span class="watchlist-star ${isInWatchlistFlag ? 'active' : ''}" data-symbol="${stock.symbol}" title="${isInWatchlistFlag ? 'Remove from Watchlist' : 'Add to Watchlist'}">${isInWatchlistFlag ? '⭐' : '☆'}</span>
                    </td>
                    <td>
                        <div class="stock-cell">
                            <div class="stock-icon">${getInitials(stock.name)}</div>
                            <div class="stock-info">
                                <div class="name">${stock.name || stock.symbol}</div>
                                <div class="symbol">${stock.symbol}</div>
                            </div>
                        </div>
                    </td>
                    <td class="price-cell">₹${formatNumber(stock.price)}</td>
                    <td class="change-cell ${changeClass}">${changePrefix}${formatNumber(stock.changePercent)}%</td>
                    <td class="volume-cell">${formatVolume(stock.volume)}</td>
                </tr>
            `;
        }).join('');

        table.innerHTML = html;

        table.querySelectorAll('tr[data-symbol]').forEach((row) => {
            row.style.cursor = 'pointer';
            row.addEventListener('click', (event) => {
                if (event.target.closest('.watchlist-star')) {
                    return;
                }

                const symbol = row.getAttribute('data-symbol');
                if (symbol) {
                    handleStockClick(symbol);
                }
            });
        });
        
    }

    function renderTrending(data) {
        if (!elements.trendingList) return;

        if (!data || !data.length) {
            elements.trendingList.innerHTML = '<div style="text-align: center; padding: 20px; color: #6b7280;">No trending stocks</div>';
            return;
        }

        const html = data.slice(0, 6).map(stock => {
            const changeClass = getChangeClass(stock.changePercent);
            const changePrefix = stock.changePercent >= 0 ? '+' : '';
            
            return `
                <div class="trending-item" data-symbol="${stock.symbol}">
                    <div class="trending-icon">${getInitials(stock.name)}</div>
                    <div class="trending-info">
                        <div class="name">${stock.name || stock.symbol}</div>
                        <div class="price">₹${formatNumber(stock.price)}</div>
                    </div>
                    <div class="trending-change ${changeClass}">${changePrefix}${formatNumber(stock.changePercent)}%</div>
                </div>
            `;
        }).join('');

        elements.trendingList.innerHTML = html;
        elements.trendingList.querySelectorAll('.trending-item').forEach(item => {
            item.addEventListener('click', () => handleStockClick(item.dataset.symbol));
        });
    }

    function renderTrendingFallback() {
        const fallbackData = [
            { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2850.00, changePercent: 0.44 },
            { symbol: 'TCS', name: 'Tata Consultancy', price: 4250.00, changePercent: -0.19 },
            { symbol: 'INFY', name: 'Infosys Ltd', price: 1850.00, changePercent: 1.22 },
            { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1680.00, changePercent: -0.32 },
            { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1120.00, changePercent: 0.77 },
            { symbol: 'SBIN', name: 'State Bank of India', price: 780.00, changePercent: 1.99 }
        ];
        renderTrending(fallbackData);
    }

    // ==================== Table Sorting and Filtering Functions ====================

    function sortTableData(data, sortKey, direction) {
        if (!sortKey || !data || !data.length) return data;

        return [...data].sort((a, b) => {
            let aVal, bVal;

            switch (sortKey) {
                case 'price':
                    aVal = a.price || 0;
                    bVal = b.price || 0;
                    break;
                case 'change':
                    aVal = a.changePercent || 0;
                    bVal = b.changePercent || 0;
                    break;
                case 'volume':
                    aVal = a.volume || 0;
                    bVal = b.volume || 0;
                    break;
                default:
                    return 0;
            }

            if (direction === 'asc') {
                return aVal - bVal;
            } else {
                return bVal - aVal;
            }
        });
    }

    function filterTableData(data, searchTerm, tableId) {
        if (!data || !data.length) return data;

        let filtered = [...data];

        // Apply search filter
        if (searchTerm && searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(stock =>
                (stock.name && stock.name.toLowerCase().includes(term)) ||
                (stock.symbol && stock.symbol.toLowerCase().includes(term))
            );
        }

        // Apply sorting
        if (tableId) {
            const sortState = tableSortStates[tableId] || { key: null, direction: 'asc' };
            if (sortState.key) {
                filtered = sortTableData(filtered, sortState.key, sortState.direction);
            }
        }

        return filtered;
    }

    function updateTableSorting(tableId, data) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const sortState = tableSortStates[tableId];
        if (!sortState || !sortState.key) {
            // No sorting applied, render original data
            renderTable(tableId, data, false);
            return;
        }

        const sortedData = sortTableData(data, sortState.key, sortState.direction);
        renderTable(tableId, sortedData, false);
    }

    function handleTableSort(tableId, sortKey) {
        const sortState = tableSortStates[tableId];

        if (sortState.key === sortKey) {
            // Toggle direction
            sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            // New sort key
            sortState.key = sortKey;
            sortState.direction = (sortKey === 'change' || sortKey === 'volume') ? 'desc' : 'asc';
        }

        // Update sort icons
        updateSortIcons(tableId);

        // Get current table data and re-render
        const tableData = getTableData(tableId);
        if (tableData) {
            updateTableSorting(tableId, tableData);
        }
    }

    function updateSortIcons(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const headers = table.closest('.data-table-card').querySelectorAll('.sortable');
        const sortState = tableSortStates[tableId];

        headers.forEach(header => {
            const icon = header.querySelector('.sort-icon');
            const key = header.getAttribute('data-sort');
            const isActive = key === sortState.key;

            header.classList.toggle('sorted-active', isActive);
            header.setAttribute('aria-sort', isActive ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none');

            if (isActive) {
                if (sortState.direction === 'asc') {
                    icon.textContent = '↑';
                } else {
                    icon.textContent = '↓';
                }
            } else {
                icon.textContent = '';
            }
        });
    }

    function getTableData(tableId) {
        // Return stored data if available
        if (tableDataStore[tableId] && tableDataStore[tableId].length > 0) {
            return tableDataStore[tableId];
        }

        // Fallback data if no stored data
        const fallbackData = {
            gainersTable: [
                { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2850.00, changePercent: 1.25, volume: 4500000 },
                { symbol: 'TCS', name: 'Tata Consultancy', price: 4250.00, changePercent: 0.85, volume: 3200000 },
                { symbol: 'INFY', name: 'Infosys Ltd', price: 1850.00, changePercent: 2.15, volume: 5800000 },
                { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1680.00, changePercent: 0.65, volume: 4100000 }
            ],
            losersTable: [
                { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6850.00, changePercent: -2.15, volume: 2800000 },
                { symbol: 'ADANI', name: 'Adani Enterprises', price: 3150.00, changePercent: -1.85, volume: 3500000 },
                { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 780.00, changePercent: -1.25, volume: 5200000 },
                { symbol: 'WIPRO', name: 'Wipro Ltd', price: 520.00, changePercent: -0.95, volume: 4100000 }
            ],
            volumeTable: [
                { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2850.00, changePercent: 0.45, volume: 8500000 },
                { symbol: 'INFY', name: 'Infosys Ltd', price: 1850.00, changePercent: 1.22, volume: 7200000 },
                { symbol: 'TCS', name: 'Tata Consultancy', price: 4250.00, changePercent: -0.19, volume: 6800000 },
                { symbol: 'SBIN', name: 'State Bank of India', price: 780.00, changePercent: 1.99, volume: 6500000 }
            ],
            volatileTable: [
                { symbol: 'ADANI', name: 'Adani Enterprises', price: 3150.00, changePercent: 3.85, volume: 4500000 },
                { symbol: 'INFY', name: 'Infosys Ltd', price: 1850.00, changePercent: 2.15, volume: 5800000 },
                { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6850.00, changePercent: -2.15, volume: 2800000 },
                { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 780.00, changePercent: -1.85, volume: 5200000 }
            ]
        };

        return fallbackData[tableId] || [];
    }

    function setupTableSorting() {
        const tableIds = ['gainersTable', 'losersTable', 'volumeTable', 'volatileTable'];

        tableIds.forEach(tableId => {
            const tableCard = document.querySelector(`#${tableId}`).closest('.data-table-card');
            if (!tableCard) return;

            const sortableHeaders = tableCard.querySelectorAll('.sortable');

            sortableHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const sortKey = header.getAttribute('data-sort');
                    if (sortKey) {
                        handleTableSort(tableId, sortKey);
                    }
                });
            });
        });
    }

    function setupTableFiltering() {
        const tableIds = ['gainersTable', 'losersTable', 'volumeTable', 'volatileTable'];

        tableIds.forEach(tableId => {
            const tableCard = document.querySelector(`#${tableId}`).closest('.data-table-card');
            if (!tableCard) return;

            const filterInput = tableCard.querySelector('.table-filter-input');
            const sortSelect = tableCard.querySelector('.table-sort-select');

            if (filterInput) {
                filterInput.addEventListener('input', () => {
                    applyTableFilters(tableId);
                });
            }

            if (sortSelect) {
                sortSelect.addEventListener('change', () => {
                    const sortKey = sortSelect.value;
                    if (sortKey) {
                        handleTableSort(tableId, sortKey);
                    } else {
                        // Reset sorting
                        tableSortStates[tableId].key = null;
                        updateSortIcons(tableId);
                        const tableData = getTableData(tableId);
                        const filteredData = filterTableData(tableData, filterInput ? filterInput.value : '', tableId);
                        renderTable(tableId, filteredData, false);
                    }
                });
            }
        });
    }

    function applyTableFilters(tableId) {
        const tableCard = document.querySelector(`#${tableId}`).closest('.data-table-card');
        if (!tableCard) return;

        const filterInput = tableCard.querySelector('.table-filter-input');
        const searchTerm = filterInput ? filterInput.value : '';

        const tableData = getTableData(tableId);
        const filteredData = filterTableData(tableData, searchTerm, tableId);

        renderTable(tableId, filteredData, false);
    }

    // ==================== Watchlist Functions ====================

    function loadWatchlist() {
        try {
            const saved = localStorage.getItem('finedu_watchlist');
            if (saved) {
                watchlist = new Set(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading watchlist:', error);
            watchlist = new Set();
        }
    }

    function saveWatchlist() {
        try {
            localStorage.setItem('finedu_watchlist', JSON.stringify([...watchlist]));
        } catch (error) {
            console.error('Error saving watchlist:', error);
        }
    }

    function toggleWatchlist(symbol) {
        if (watchlist.has(symbol)) {
            watchlist.delete(symbol);
        } else {
            watchlist.add(symbol);
        }
        saveWatchlist();
        updateWatchlistStars();
        renderWatchlistSection();
    }

    function isInWatchlist(symbol) {
        return watchlist.has(symbol);
    }

    function updateWatchlistStars() {
        // Update all star icons across all tables
        document.querySelectorAll('.watchlist-star').forEach(star => {
            const symbol = star.getAttribute('data-symbol');
            if (symbol) {
                const isActive = isInWatchlist(symbol);
                star.classList.toggle('active', isActive);
                star.textContent = isActive ? '⭐' : '☆';
                star.title = isActive ? 'Remove from Watchlist' : 'Add to Watchlist';
            }
        });
    }

    function renderWatchlistSection() {
        const watchlistSection = document.getElementById('watchlistSection');
        const watchlistTable = document.getElementById('watchlistTable');
        const clearBtn = document.getElementById('clearWatchlistBtn');

        if (!watchlistSection || !watchlistTable) return;

        // Keep watchlist scoped to Stocks tab so other tabs show only related content.
        if (currentCategory !== 'stocks') {
            watchlistSection.style.display = 'none';
            if (clearBtn) clearBtn.style.display = 'none';
            return;
        }

        if (watchlist.size === 0) {
            watchlistSection.style.display = 'none';
            if (clearBtn) clearBtn.style.display = 'none';
            return;
        }

        watchlistSection.style.display = 'block';
        if (clearBtn) clearBtn.style.display = 'block';

        // Get all table data to find watchlist stocks
        const allStocks = [];
        Object.values(tableDataStore).forEach(tableData => {
            if (tableData && tableData.length > 0) {
                allStocks.push(...tableData);
            }
        });

        // Filter stocks that are in watchlist
        const watchlistStocks = allStocks.filter((stock, index, stocks) =>
            isInWatchlist(stock.symbol) && stocks.findIndex(item => item.symbol === stock.symbol) === index
        );

        if (!watchlistStocks.length) {
            watchlistSection.style.display = 'none';
            if (clearBtn) clearBtn.style.display = 'none';
            return;
        }

        const html = watchlistStocks.map(stock => {
            const changeClass = getChangeClass(stock.changePercent);
            const changePrefix = stock.changePercent >= 0 ? '+' : '';
            
            return `
                <tr data-symbol="${stock.symbol}">
                    <td>
                        <div class="stock-cell">
                            <div class="stock-icon">${getInitials(stock.name)}</div>
                            <div class="stock-info">
                                <div class="name">${stock.name || stock.symbol}</div>
                                <div class="symbol">${stock.symbol}</div>
                            </div>
                        </div>
                    </td>
                    <td class="price-cell">₹${formatNumber(stock.price)}</td>
                    <td class="change-cell ${changeClass}">${changePrefix}${formatNumber(stock.changePercent)}%</td>
                    <td class="volume-cell">${formatVolume(stock.volume)}</td>
                    <td class="watchlist-cell">
                        <span class="watchlist-star active" data-symbol="${stock.symbol}" title="Remove from Watchlist">⭐</span>
                    </td>
                </tr>
            `;
        }).join('');

        watchlistTable.innerHTML = html;

    }

    function clearWatchlist() {
        watchlist.clear();
        saveWatchlist();
        updateWatchlistStars();
        renderWatchlistSection();
    }

    function setupWatchlist() {
        // Load watchlist from localStorage
        loadWatchlist();

        // Add click handlers for all watchlist stars
        document.addEventListener('click', (e) => {
            const star = e.target.closest('.watchlist-star');
            if (star) {
                e.preventDefault();
                e.stopPropagation();
                const symbol = star.getAttribute('data-symbol');
                if (symbol) {
                    toggleWatchlist(symbol);
                }
            }
        });

        // Add click handler for clear watchlist button
        const clearBtn = document.getElementById('clearWatchlistBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearWatchlist);
        }

        // Initial render
        updateWatchlistStars();
        renderWatchlistSection();
    }

    // ==================== ETF Functions ====================

    function renderETFCards(data) {
        if (!elements.etfCardsGrid) return;
        
        if (!data || !data.length) {
            elements.etfCardsGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #6b7280;">Loading ETF data...</div>';
            return;
        }

        const html = data.map(etf => {
            const changeClass = getChangeClass(etf.percentageChange);
            const changePrefix = etf.percentageChange >= 0 ? '+' : '';
            
            return `
                <div class="etf-card" data-symbol="${etf.symbol}">
                    <div class="etf-card-header">
                        <div class="etf-icon">${etf.name.substring(0, 2).toUpperCase()}</div>
                        <div class="etf-info">
                            <h4>${etf.name}</h4>
                            <span class="etf-symbol">${etf.symbol}</span>
                        </div>
                    </div>
                    <div class="etf-price-row">
                        <span class="etf-price">₹${formatNumber(etf.price)}</span>
                        <span class="etf-change ${changeClass}">${changePrefix}${formatNumber(etf.percentageChange)}%</span>
                    </div>
                    <div class="etf-mini-chart">
                        ${renderMiniChart(etf.chartData, etf.percentageChange)}
                    </div>
                </div>
            `;
        }).join('');

        elements.etfCardsGrid.innerHTML = html;
        
        // Add click handlers to ETF cards
        elements.etfCardsGrid.querySelectorAll('.etf-card').forEach(card => {
            card.addEventListener('click', () => {
                const symbol = card.dataset.symbol;
                const selectedETF = data.find(etf => etf.symbol === symbol);
                if (selectedETF) {
                    // Update the dropdown selector
                    const selector = document.getElementById('etfChartSelector');
                    if (selector) {
                        selector.value = symbol;
                    }
                    // Initialize the chart with selected ETF
                    loadETFChart(selectedETF.symbol);
                }
            });
        });
    }

    function renderMiniChart(chartData, changePercent) {
        if (!chartData || !chartData.length) {
            // Render placeholder if no chart data
            return `<div class="mini-chart-placeholder"></div>`;
        }

        const prices = chartData.map(d => d.close);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const range = maxPrice - minPrice || 1;
        
        const points = prices.map((price, i) => {
            const x = (i / (prices.length - 1)) * 100;
            const y = 100 - ((price - minPrice) / range) * 100;
            return `${x},${y}`;
        }).join(' ');

        const color = changePercent >= 0 ? '#16a34a' : '#dc2626';

        return `
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" class="mini-chart-svg">
                <polyline
                    fill="none"
                    stroke="${color}"
                    stroke-width="2"
                    points="${points}"
                />
            </svg>
        `;
    }

    function renderETFTable(data) {
        if (!elements.etfTable) return;

        if (!data || !data.length) {
            elements.etfTable.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #6b7280;">No ETF data available</td></tr>';
            return;
        }

        // Sort data
        const sortedData = [...data].sort((a, b) => {
            const aVal = a[etfSort.key];
            const bVal = b[etfSort.key];
            const dir = etfSort.direction === 'asc' ? 1 : -1;
            
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return (aVal - bVal) * dir;
            }
            return String(aVal || '').localeCompare(String(bVal || '')) * dir;
        });

        const html = sortedData.map(etf => {
            const changeClass = getChangeClass(etf.percentageChange);
            const changePrefix = etf.percentageChange >= 0 ? '+' : '';
            
            return `
                <tr>
                    <td>
                        <div class="stock-cell">
                            <div class="stock-icon" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9);">${etf.name.substring(0, 2).toUpperCase()}</div>
                            <div class="stock-info">
                                <div class="name">${etf.name}</div>
                            </div>
                        </div>
                    </td>
                    <td class="price-cell">${etf.symbol}</td>
                    <td class="price-cell">₹${formatNumber(etf.price)}</td>
                    <td class="change-cell ${changeClass}">${changePrefix}${formatNumber(etf.percentageChange)}%</td>
                    <td class="volume-cell">${formatVolume(etf.volume)}</td>
                </tr>
            `;
        }).join('');

        elements.etfTable.innerHTML = html;
        
        // Add click handlers to ETF table rows
        elements.etfTable.querySelectorAll('tr').forEach(row => {
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => {
                const symbol = row.querySelector('.price-cell')?.textContent;
                if (symbol && etfData.length > 0) {
                    const selectedETF = etfData.find(etf => etf.symbol === symbol);
                    if (selectedETF) {
                        // Update the dropdown selector
                        const selector = document.getElementById('etfChartSelector');
                        if (selector) {
                            selector.value = symbol;
                        }
                        // Initialize the chart with selected ETF
                        loadETFChart(selectedETF.symbol);
                    }
                }
            });
        });
    }

    function initETFSorting() {
        const headers = elements.etfTable?.querySelectorAll('th.sortable');
        if (!headers) return;

        headers.forEach(header => {
            header.addEventListener('click', () => {
                const key = header.getAttribute('data-sort-key');
                if (!key) return;

                if (etfSort.key === key) {
                    etfSort.direction = etfSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    etfSort.key = key;
                    etfSort.direction = key === 'name' || key === 'symbol' ? 'asc' : 'desc';
                }
                renderETFTable(etfData);
            });
        });
    }

    async function loadETFData() {
        try {
            const data = await fetchAPI('/api/etfs');
            if (data && Array.isArray(data)) {
                etfData = data;
                renderETFCards(data);
                renderETFTable(data);
                populateETFChartSelector(data);
                loadETFChart(data[0]?.symbol);
                updateLastUpdated();
                setupETFAutoRefresh();
                hideETFError();
            } else {
                showETFError();
            }
        } catch (error) {
            console.error('ETF load error:', error);
            showETFError();
            // Use fallback data
            const fallback = [
                { symbol: "NIFTYBEES", name: "Nifty Bees", category: "Equity", price: 235.40, percentageChange: 0.81, volume: 1200000, chartData: [] },
                { symbol: "BANKBEES", name: "Bank Bees", category: "Equity", price: 485.20, percentageChange: 0.98, volume: 850000, chartData: [] },
                { symbol: "GOLDBEES", name: "Gold Bees", category: "Gold", price: 52.80, percentageChange: 0.76, volume: 2100000, chartData: [] },
                { symbol: "SILVERBEES", name: "Silver Bees", category: "Gold", price: 98.50, percentageChange: 1.34, volume: 650000, chartData: [] },
                { symbol: "ITBEES", name: "IT Bees", category: "Sector", price: 425.60, percentageChange: 1.26, volume: 420000, chartData: [] },
                { symbol: "CPSEETF", name: "CPSE ETF", category: "Sector", price: 68.90, percentageChange: 1.03, volume: 380000, chartData: [] }
            ];
            etfData = fallback;
            renderETFCards(fallback);
            renderETFTable(fallback);
            populateETFChartSelector(fallback);
            loadETFChart(fallback[0]?.symbol);
        }
    }

    function populateETFChartSelector(data) {
        const selector = document.getElementById('etfChartSelector');
        if (!selector) return;
        
        selector.innerHTML = data.map(etf => 
            `<option value="${etf.symbol}">${etf.name} (${etf.symbol})</option>`
        ).join('');
        
        selector.addEventListener('change', (e) => {
            const selected = data.find(etf => etf.symbol === e.target.value);
            if (selected) loadETFChart(selected.symbol);
        });
    }

    function getETFTradingViewSymbol(symbol) {
        const clean = String(symbol || '').trim().toUpperCase();
        if (!clean) return 'NSE:NIFTYBEES';
        if (clean.includes(':')) return clean;
        return `NSE:${clean}`;
    }

    function loadTradingViewLibrary() {
        if (window.TradingView) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const existing = document.getElementById('tradingview-widget-script');
            if (existing) {
                existing.addEventListener('load', () => resolve(), { once: true });
                existing.addEventListener('error', () => reject(new Error('Failed to load TradingView script.')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.id = 'tradingview-widget-script';
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load TradingView script.'));
            document.head.appendChild(script);
        });
    }

    async function loadETFChart(symbol) {
        const chartContainer = document.getElementById('etfChart');
        const chartError = document.getElementById('etfChartError');
        if (!chartContainer) return;
        
        // Clear any existing chart before loading a new widget to avoid render conflicts.
        if (etfChart && typeof etfChart.remove === 'function') {
            etfChart.remove();
            etfChart = null;
        }
        if (etfChartResizeHandler) {
            window.removeEventListener('resize', etfChartResizeHandler);
            etfChartResizeHandler = null;
        }
        chartContainer.innerHTML = '';
        
        try {
            await loadTradingViewLibrary();

            if (chartError) chartError.style.display = 'none';

            const tvSymbol = getETFTradingViewSymbol(symbol);
            etfChart = new window.TradingView.widget({
                container_id: 'etfChart',
                symbol: tvSymbol,
                watchlist: [
                    'NSE:NIFTYBEES',
                    'NSE:BANKBEES',
                    'NSE:GOLDBEES',
                    'NSE:SILVERBEES',
                    'NSE:ITBEES',
                    'NSE:CPSEETF'
                ],
                interval: 'D',
                timezone: 'Asia/Kolkata',
                theme: 'light',
                style: '1',
                locale: 'en',
                withdateranges: true,
                allow_symbol_change: true,
                hide_side_toolbar: false,
                autosize: true,
                studies: ['Volume@tv-basicstudies']
            });
        } catch (error) {
            console.error('ETF chart error:', error);
            if (chartError) {
                chartError.style.display = 'block';
            }
        }
    }

    function initETFChart(etf) {
        loadETFChart(etf?.symbol);
    }

    function updateLastUpdated() {
        const el = document.getElementById('etfLastUpdated');
        if (el) {
            const now = new Date();
            el.textContent = 'Last updated: ' + now.toLocaleTimeString('en-IN');
        }
    }

    function showETFError() {
        const errorEl = document.getElementById('etfErrorMessage');
        if (errorEl) errorEl.style.display = 'block';
    }

    function hideETFError() {
        const errorEl = document.getElementById('etfErrorMessage');
        if (errorEl) errorEl.style.display = 'none';
    }

    function setupETFAutoRefresh() {
        if (etfRefreshTimer) clearInterval(etfRefreshTimer);
        etfRefreshTimer = setInterval(() => {
            if (currentCategory === 'etfs') {
                console.log('Refreshing ETF data...');
                loadETFData();
            }
        }, ETF_REFRESH_INTERVAL);
    }

    function filterETFs() {
        const category = document.getElementById('etfCategoryFilter')?.value || 'all';
        const search = document.getElementById('etfSearch')?.value?.toLowerCase() || '';
        
        let filtered = [...etfData];
        
        if (category !== 'all') {
            filtered = filtered.filter(etf => etf.category === category);
        }
        
        if (search) {
            filtered = filtered.filter(etf => 
                etf.name.toLowerCase().includes(search) || 
                etf.symbol.toLowerCase().includes(search)
            );
        }
        
        renderETFCards(filtered);
        renderETFTable(filtered);
    }

    // ==================== Stock Filter Functions ====================
    
    function applyStockFilters() {
        if (stocksData.length === 0) {
            // No data to filter
            return;
        }
        
        const sector = document.getElementById('filterSector')?.value || '';
        const marketCap = document.getElementById('filterMarketCap')?.value || '';
        const peRatio = document.getElementById('filterPERatio')?.value || '';
        const priceRange = document.getElementById('filterPriceRange')?.value || '';
        const volume = document.getElementById('filterVolume')?.value || '';
        const search = document.getElementById('filterSearch')?.value?.toLowerCase() || '';
        
        let filtered = [...stocksData];
        
        // Apply sector filter
        if (sector) {
            filtered = filtered.filter(stock => stock.sector === sector);
        }
        
        // Apply market cap filter
        if (marketCap) {
            filtered = filtered.filter(stock => {
                const mc = stock.marketCap || 0;
                if (marketCap === 'large') return mc >= 200000000000; // >20k Cr
                if (marketCap === 'mid') return mc >= 50000000000 && mc < 200000000000; // 5k-20k Cr
                if (marketCap === 'small') return mc < 50000000000; // <5k Cr
                return true;
            });
        }
        
        // Apply PE ratio filter
        if (peRatio) {
            filtered = filtered.filter(stock => {
                const pe = stock.peRatio;
                if (peRatio === 'low') return pe > 0 && pe < 15;
                if (peRatio === 'medium') return pe >= 15 && pe <= 30;
                if (peRatio === 'high') return pe > 30;
                if (peRatio === 'negative') return pe < 0;
                return true;
            });
        }
        
        // Apply price range filter
        if (priceRange) {
            filtered = filtered.filter(stock => {
                const price = stock.price || 0;
                if (priceRange === 'under50') return price < 50;
                if (priceRange === '50to200') return price >= 50 && price < 200;
                if (priceRange === '200to1000') return price >= 200 && price < 1000;
                if (priceRange === '1000to5000') return price >= 1000 && price < 5000;
                if (priceRange === 'above5000') return price >= 5000;
                return true;
            });
        }
        
        // Apply volume filter
        if (volume) {
            filtered = filtered.filter(stock => {
                const vol = stock.volume || 0;
                if (volume === 'high') return vol >= 10000000; // >10L
                if (volume === 'medium') return vol >= 1000000 && vol < 10000000; // 1L-10L
                if (volume === 'low') return vol < 1000000; // <1L
                return true;
            });
        }
        
        // Apply search filter
        if (search) {
            filtered = filtered.filter(stock => 
                stock.name?.toLowerCase().includes(search) || 
                stock.symbol?.toLowerCase().includes(search)
            );
        }
        
        // Render filtered data in tables
        // Show filtered stocks in gainers table for demo
        renderTable('gainersTable', filtered.slice(0, 8));
        renderTable('losersTable', filtered.slice(8, 16) || []);
        renderTable('volumeTable', filtered.slice(16, 24) || []);
        renderTable('volatileTable', filtered.slice(24, 32) || []);
    }
    
    function clearStockFilters() {
        // Reset all filter dropdowns if they exist
        const filterSector = document.getElementById('filterSector');
        const filterMarketCap = document.getElementById('filterMarketCap');
        const filterPERatio = document.getElementById('filterPERatio');
        const filterPriceRange = document.getElementById('filterPriceRange');
        const filterVolume = document.getElementById('filterVolume');
        const filterSearch = document.getElementById('filterSearch');
        
        if (filterSector) filterSector.value = '';
        if (filterMarketCap) filterMarketCap.value = '';
        if (filterPERatio) filterPERatio.value = '';
        if (filterPriceRange) filterPriceRange.value = '';
        if (filterVolume) filterVolume.value = '';
        if (filterSearch) filterSearch.value = '';
        
        // Reload original data
        loadAllData();
    }

    function setupStockFilters() {
        // Check if filter elements exist before setting up event listeners
        const applyBtn = document.getElementById('applyFilters');
        const clearBtn = document.getElementById('clearFilters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', applyStockFilters);
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', clearStockFilters);
        }
        
        // Also apply filters on Enter key in search box (if it exists)
        const searchInput = document.getElementById('filterSearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    applyStockFilters();
                }
            });
        }
    }

    // ==================== Futures Dashboard Functions ====================

    let futuresSort = { key: 'contract', direction: 'asc' };

    function parseFuturesNumber(raw) {
        if (!raw) return 0;
        const normalized = String(raw).replace(/,/g, '').replace(/[^0-9+\-.]/g, '');
        const value = Number(normalized);
        return Number.isFinite(value) ? value : 0;
    }

    function parseFuturesVolume(raw) {
        if (!raw) return 0;
        const text = String(raw).trim().toUpperCase();
        const base = parseFuturesNumber(text);
        if (text.includes('CR')) return base * 10000000;
        if (text.includes('L')) return base * 100000;
        if (text.includes('K')) return base * 1000;
        return base;
    }

    function parseFuturesDate(raw) {
        if (!raw) return null;
        const dt = new Date(raw);
        return Number.isNaN(dt.getTime()) ? null : dt;
    }

    function daysUntil(targetDate) {
        if (!targetDate) return Number.POSITIVE_INFINITY;
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        return Math.round((target - start) / 86400000);
    }

    function getFuturesRowsData(tbody) {
        return Array.from(tbody.querySelectorAll('tr')).map((row) => {
            const cells = row.querySelectorAll('td');
            const contract = cells[0]?.querySelector('.name')?.textContent?.trim() || '';
            const symbol = cells[1]?.textContent?.trim() || '';
            const priceText = cells[2]?.textContent?.trim() || '';
            const changeText = cells[3]?.textContent?.trim() || '';
            const expiryText = cells[4]?.textContent?.trim() || '';
            const volumeText = cells[5]?.textContent?.trim() || '';
            const expiryDate = parseFuturesDate(expiryText);

            return {
                row,
                contract,
                symbol,
                priceText,
                changeText,
                expiryText,
                volumeText,
                price: parseFuturesNumber(priceText),
                change: parseFuturesNumber(changeText),
                expiryDate,
                expiryTime: expiryDate ? expiryDate.getTime() : Number.POSITIVE_INFINITY,
                volume: parseFuturesVolume(volumeText)
            };
        });
    }

    function updateFuturesSortUi(table, sortState) {
        table.querySelectorAll('th[data-futures-sort]').forEach((header) => {
            const key = header.getAttribute('data-futures-sort');
            const icon = header.querySelector('.sort-icon');
            const active = key === sortState.key;

            header.classList.toggle('sorted-active', active);
            header.setAttribute('aria-sort', active ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none');
            if (icon) {
                icon.textContent = active ? (sortState.direction === 'asc' ? '↑' : '↓') : '';
            }
        });
    }

    function applyFuturesNearExpiryStyles(tbody) {
        Array.from(tbody.querySelectorAll('tr')).forEach((row) => {
            row.classList.remove('futures-near-expiry');

            const expiryCell = row.querySelectorAll('td')[4];
            if (!expiryCell) return;

            const existingFlag = expiryCell.querySelector('.futures-expiry-flag');
            if (existingFlag) existingFlag.remove();

            const expiryText = expiryCell.textContent.trim();
            const expiryDate = parseFuturesDate(expiryText);
            const days = daysUntil(expiryDate);

            if (days >= 0 && days <= 7) {
                row.classList.add('futures-near-expiry');
                const flag = document.createElement('span');
                flag.className = 'futures-expiry-flag';
                flag.textContent = days === 0 ? 'Expires Today' : `${days}d left`;
                expiryCell.appendChild(flag);
            }
        });
    }

    function sortFuturesTable(tbody) {
        const rows = getFuturesRowsData(tbody);
        const key = futuresSort.key;
        const dir = futuresSort.direction === 'asc' ? 1 : -1;

        rows.sort((a, b) => {
            let av;
            let bv;

            switch (key) {
                case 'price':
                    av = a.price;
                    bv = b.price;
                    break;
                case 'change':
                    av = a.change;
                    bv = b.change;
                    break;
                case 'expiry':
                    av = a.expiryTime;
                    bv = b.expiryTime;
                    break;
                case 'volume':
                    av = a.volume;
                    bv = b.volume;
                    break;
                case 'symbol':
                    av = a.symbol;
                    bv = b.symbol;
                    break;
                case 'contract':
                default:
                    av = a.contract;
                    bv = b.contract;
                    break;
            }

            if (typeof av === 'number' && typeof bv === 'number') {
                return (av - bv) * dir;
            }

            return String(av || '').localeCompare(String(bv || '')) * dir;
        });

        rows.forEach(item => tbody.appendChild(item.row));
        applyFuturesNearExpiryStyles(tbody);
    }

    function syncFuturesHighlightsFromTable(tbody) {
        const findBySymbol = (symbol) => getFuturesRowsData(tbody).find(item => item.symbol === symbol);

        const nifty = findBySymbol('NSE:NIFTY1!');
        const bank = findBySymbol('NSE:BANKNIFTY1!');
        const gold = findBySymbol('MCX:GOLD1!');

        if (nifty) {
            const priceEl = document.getElementById('futNiftyPrice');
            const changeEl = document.getElementById('futNiftyChange');
            const expiryEl = document.getElementById('futNiftyExpiry');
            if (priceEl) priceEl.textContent = nifty.priceText;
            if (changeEl) {
                changeEl.textContent = nifty.changeText;
                changeEl.className = nifty.change >= 0 ? 'positive' : 'negative';
            }
            if (expiryEl) expiryEl.textContent = nifty.expiryText;
        }

        if (bank) {
            const priceEl = document.getElementById('futBankPrice');
            const changeEl = document.getElementById('futBankChange');
            const expiryEl = document.getElementById('futBankExpiry');
            if (priceEl) priceEl.textContent = bank.priceText;
            if (changeEl) {
                changeEl.textContent = bank.changeText;
                changeEl.className = bank.change >= 0 ? 'positive' : 'negative';
            }
            if (expiryEl) expiryEl.textContent = bank.expiryText;
        }

        if (gold) {
            const priceEl = document.getElementById('futGoldPrice');
            const changeEl = document.getElementById('futGoldChange');
            const expiryEl = document.getElementById('futGoldExpiry');
            if (priceEl) priceEl.textContent = gold.priceText;
            if (changeEl) {
                changeEl.textContent = gold.changeText;
                changeEl.className = gold.change >= 0 ? 'positive' : 'negative';
            }
            if (expiryEl) expiryEl.textContent = gold.expiryText;
        }
    }

    function initFuturesDashboard() {
        const table = document.getElementById('futuresContractTable');
        const tbody = document.getElementById('futuresTable');
        if (!table || !tbody) return;

        table.querySelectorAll('th[data-futures-sort]').forEach((header) => {
            header.addEventListener('click', () => {
                const key = header.getAttribute('data-futures-sort');
                if (!key) return;

                if (futuresSort.key === key) {
                    futuresSort.direction = futuresSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    futuresSort.key = key;
                    futuresSort.direction = (key === 'contract' || key === 'symbol') ? 'asc' : 'desc';
                }

                updateFuturesSortUi(table, futuresSort);
                sortFuturesTable(tbody);
            });
        });

        updateFuturesSortUi(table, futuresSort);
        sortFuturesTable(tbody);
        syncFuturesHighlightsFromTable(tbody);
    }

    // ==================== Forex Dashboard Functions ====================

    let forexSort = { key: 'pair', direction: 'asc' };

    function parseForexNumber(raw) {
        if (!raw) return 0;
        const normalized = String(raw).replace(/,/g, '').replace(/[^0-9+\-.]/g, '');
        const value = Number(normalized);
        return Number.isFinite(value) ? value : 0;
    }

    function getForexRowsData(tbody) {
        return Array.from(tbody.querySelectorAll('tr')).map((row) => {
            const cells = row.querySelectorAll('td');
            const pair = cells[0]?.querySelector('.name')?.textContent?.trim() || '';
            const symbol = cells[1]?.textContent?.trim() || '';
            const bidText = cells[2]?.textContent?.trim() || '';
            const askText = cells[3]?.textContent?.trim() || '';
            const spreadText = cells[4]?.textContent?.trim() || '';
            const changeText = cells[5]?.textContent?.trim() || '';

            return {
                row,
                pair,
                symbol,
                bidText,
                askText,
                spreadText,
                changeText,
                bid: parseForexNumber(bidText),
                ask: parseForexNumber(askText),
                spread: parseForexNumber(spreadText),
                change: parseForexNumber(changeText)
            };
        });
    }

    function updateForexSortUi(table) {
        table.querySelectorAll('th[data-forex-sort]').forEach((header) => {
            const key = header.getAttribute('data-forex-sort');
            const icon = header.querySelector('.sort-icon');
            const active = key === forexSort.key;

            header.classList.toggle('sorted-active', active);
            header.setAttribute('aria-sort', active ? (forexSort.direction === 'asc' ? 'ascending' : 'descending') : 'none');
            if (icon) {
                icon.textContent = active ? (forexSort.direction === 'asc' ? '↑' : '↓') : '';
            }
        });
    }

    function calculateForexSpreads(tbody) {
        Array.from(tbody.querySelectorAll('tr')).forEach((row) => {
            const cells = row.querySelectorAll('td');
            const symbol = cells[1]?.textContent?.trim() || '';
            const bid = parseForexNumber(cells[2]?.textContent?.trim());
            const ask = parseForexNumber(cells[3]?.textContent?.trim());
            const spreadCell = cells[4];
            if (!spreadCell || !bid || !ask) return;

            const spread = ask - bid;
            const decimals = symbol.includes('INR') || symbol.includes('JPY') ? 2 : 4;
            spreadCell.textContent = spread.toFixed(decimals);
        });
    }

    function sortForexTable(tbody) {
        const rows = getForexRowsData(tbody);
        const key = forexSort.key;
        const dir = forexSort.direction === 'asc' ? 1 : -1;

        rows.sort((a, b) => {
            let av;
            let bv;

            switch (key) {
                case 'bid':
                    av = a.bid;
                    bv = b.bid;
                    break;
                case 'ask':
                    av = a.ask;
                    bv = b.ask;
                    break;
                case 'spread':
                    av = a.spread;
                    bv = b.spread;
                    break;
                case 'change':
                    av = a.change;
                    bv = b.change;
                    break;
                case 'symbol':
                    av = a.symbol;
                    bv = b.symbol;
                    break;
                case 'pair':
                default:
                    av = a.pair;
                    bv = b.pair;
                    break;
            }

            if (typeof av === 'number' && typeof bv === 'number') {
                return (av - bv) * dir;
            }

            return String(av || '').localeCompare(String(bv || '')) * dir;
        });

        rows.forEach(item => tbody.appendChild(item.row));
    }

    function syncForexMajorCards(tbody) {
        const bySymbol = (symbol) => getForexRowsData(tbody).find(item => item.symbol === symbol);
        const map = [
            { symbol: 'EURUSD', priceId: 'fxMajorEurUsdPrice', changeId: 'fxMajorEurUsdChange' },
            { symbol: 'USDINR', priceId: 'fxMajorUsdInrPrice', changeId: 'fxMajorUsdInrChange' },
            { symbol: 'GBPUSD', priceId: 'fxMajorGbpUsdPrice', changeId: 'fxMajorGbpUsdChange' },
            { symbol: 'USDJPY', priceId: 'fxMajorUsdJpyPrice', changeId: 'fxMajorUsdJpyChange' }
        ];

        map.forEach((item) => {
            const row = bySymbol(item.symbol);
            if (!row) return;

            const priceEl = document.getElementById(item.priceId);
            const changeEl = document.getElementById(item.changeId);
            if (priceEl) priceEl.textContent = row.bidText;
            if (changeEl) {
                changeEl.textContent = row.changeText;
                changeEl.className = `forex-major-change ${row.change >= 0 ? 'positive' : 'negative'}`;
            }
        });
    }

    function initForexDashboard() {
        const table = document.getElementById('forexPairsTable');
        const tbody = document.getElementById('forexTable');
        if (!table || !tbody) return;

        calculateForexSpreads(tbody);
        syncForexMajorCards(tbody);

        table.querySelectorAll('th[data-forex-sort]').forEach((header) => {
            header.addEventListener('click', () => {
                const key = header.getAttribute('data-forex-sort');
                if (!key) return;

                if (forexSort.key === key) {
                    forexSort.direction = forexSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    forexSort.key = key;
                    forexSort.direction = (key === 'pair' || key === 'symbol') ? 'asc' : 'desc';
                }

                updateForexSortUi(table);
                sortForexTable(tbody);
            });
        });

        updateForexSortUi(table);
    }

    function updateLearningSectionVisibility(category) {
        const learningSections = [
            document.querySelector('.etf-education-section'),
            document.querySelector('.futures-education-section'),
            document.querySelector('.forex-education-section'),
            document.querySelector('.bonds-education-section')
        ];

        learningSections.forEach((section) => {
            if (section) section.style.display = 'none';
        });

        const learningSectionByCategory = {
            etfs: document.querySelector('.etf-education-section'),
            futures: document.querySelector('.futures-education-section'),
            forex: document.querySelector('.forex-education-section'),
            bonds: document.querySelector('.bonds-education-section')
        };

        const activeLearningSection = learningSectionByCategory[category];
        if (activeLearningSection) {
            activeLearningSection.style.display = 'block';
        }
    }

    function switchCategory(category) {
        currentCategory = category;
        
        // Get section elements
        const futuresSection = document.getElementById('futuresSection');
        const forexSection = document.getElementById('forexSection');
        const bondsSection = document.getElementById('bondsSection');
        const etfSection = document.getElementById('etfSection');
        const indicesSection = document.getElementById('indicesSection');
        const sectorPerformanceSection = elements.sectorPerformanceSection;
        const tablesGrid = document.getElementById('tablesGrid');
        const sidebarSection = document.querySelector('.sidebar-section');
        const watchlistSection = document.getElementById('watchlistSection');
        
        // Hide all special sections first
        if (futuresSection) futuresSection.style.display = 'none';
        if (forexSection) forexSection.style.display = 'none';
        if (bondsSection) bondsSection.style.display = 'none';
        if (etfSection) etfSection.style.display = 'none';
        
        // Reset base sections.
        if (indicesSection) indicesSection.style.display = 'none';
        if (sectorPerformanceSection) sectorPerformanceSection.style.display = 'none';
        if (tablesGrid) tablesGrid.style.display = 'none';
        if (sidebarSection) sidebarSection.style.display = 'none';
        if (watchlistSection) watchlistSection.style.display = 'none';

        if (category === 'etfs') {
            if (etfSection) etfSection.style.display = 'block';
            if (etfData.length === 0) {
                loadETFData();
            }
        } else if (category === 'futures') {
            if (futuresSection) futuresSection.style.display = 'block';
        } else if (category === 'forex') {
            if (forexSection) forexSection.style.display = 'block';
        } else if (category === 'bonds') {
            if (bondsSection) bondsSection.style.display = 'block';
        } else if (category === 'indices') {
            if (indicesSection) indicesSection.style.display = 'block';
        } else if (category === 'stocks') {
            if (indicesSection) indicesSection.style.display = 'block';
            if (sectorPerformanceSection) sectorPerformanceSection.style.display = 'block';
            if (tablesGrid) tablesGrid.style.display = 'grid';
            if (sidebarSection) sidebarSection.style.display = 'grid';
        } else {
            if (indicesSection) indicesSection.style.display = 'block';
        }

        // Ensure only the active tab's learning block is visible.
        updateLearningSectionVisibility(category);

        // Re-evaluate watchlist visibility for the newly active tab.
        renderWatchlistSection();
    }

    async function loadIndices() {
        console.log('Loading indices from API...');
        const data = await fetchAPI('/api/indices');
        console.log('Indices API response:', data);
        
        if (data && Array.isArray(data) && data.length > 0) {
            renderIndices(data);
        } else {
            console.log('Using fallback indices data');
            renderIndicesFallback();
        }
    }

    async function loadGainers() {
        renderTableSkeleton('gainersTable');
        const data = await fetchAPI('/api/market/gainers');
        if (data && Array.isArray(data) && data.length > 0) {
            renderTable('gainersTable', data);
        } else {
            const fallback = [
                { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2850.00, changePercent: 1.25, volume: 4500000 },
                { symbol: 'TCS', name: 'Tata Consultancy', price: 4250.00, changePercent: 0.85, volume: 3200000 },
                { symbol: 'INFY', name: 'Infosys Ltd', price: 1850.00, changePercent: 2.15, volume: 5800000 },
                { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1680.00, changePercent: 0.65, volume: 4100000 }
            ];
            renderTable('gainersTable', fallback);
        }
    }

    async function loadLosers() {
        renderTableSkeleton('losersTable');
        const data = await fetchAPI('/api/market/losers');
        if (data && Array.isArray(data) && data.length > 0) {
            renderTable('losersTable', data);
        } else {
            const fallback = [
                { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6850.00, changePercent: -2.15, volume: 2800000 },
                { symbol: 'ADANI', name: 'Adani Enterprises', price: 3150.00, changePercent: -1.85, volume: 3500000 },
                { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 780.00, changePercent: -1.25, volume: 5200000 },
                { symbol: 'WIPRO', name: 'Wipro Ltd', price: 520.00, changePercent: -0.95, volume: 4100000 }
            ];
            renderTable('losersTable', fallback);
        }
    }

    async function loadVolume() {
        renderTableSkeleton('volumeTable');
        const data = await fetchAPI('/api/market/most-active');
        if (data && Array.isArray(data) && data.length > 0) {
            renderTable('volumeTable', data);
        } else {
            const fallback = [
                { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2850.00, changePercent: 0.45, volume: 8500000 },
                { symbol: 'INFY', name: 'Infosys Ltd', price: 1850.00, changePercent: 1.22, volume: 7200000 },
                { symbol: 'TCS', name: 'Tata Consultancy', price: 4250.00, changePercent: -0.19, volume: 6800000 },
                { symbol: 'SBIN', name: 'State Bank of India', price: 780.00, changePercent: 1.99, volume: 6500000 }
            ];
            renderTable('volumeTable', fallback);
        }
    }

    async function loadVolatile() {
        renderTableSkeleton('volatileTable');
        const data = await fetchAPI('/api/market/most-volatile');
        if (data && Array.isArray(data) && data.length > 0) {
            renderTable('volatileTable', data);
        } else {
            const fallback = [
                { symbol: 'ADANI', name: 'Adani Enterprises', price: 3150.00, changePercent: 3.85, volume: 4500000 },
                { symbol: 'INFY', name: 'Infosys Ltd', price: 1850.00, changePercent: 2.15, volume: 5800000 },
                { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6850.00, changePercent: -2.15, volume: 2800000 },
                { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 780.00, changePercent: -1.85, volume: 5200000 }
            ];
            renderTable('volatileTable', fallback);
        }
    }

    async function loadTrending() {
        const data = await fetchAPI('/api/market/trending');
        if (data && Array.isArray(data) && data.length > 0) {
            renderTrending(data);
        } else {
            renderTrendingFallback();
        }
    }

    async function loadAllData() {
        console.log('Loading market data...');
        
        // Load stock data for filtering
        const stocksResponse = await fetchAPI('/api/stocks');
        if (stocksResponse && Array.isArray(stocksResponse)) {
            stocksData = stocksResponse;
        } else {
            // Create fallback stock data with all needed fields
            stocksData = [
                { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', price: 2850.00, changePercent: 1.25, volume: 4500000, marketCap: 1900000000000, peRatio: 28.5 },
                { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', price: 4250.00, changePercent: 0.85, volume: 3200000, marketCap: 1550000000000, peRatio: 32.1 },
                { symbol: 'INFY', name: 'Infosys Ltd', sector: 'IT', price: 1850.00, changePercent: 2.15, volume: 5800000, marketCap: 770000000000, peRatio: 25.8 },
                { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', price: 1680.00, changePercent: 0.65, volume: 4100000, marketCap: 1250000000000, peRatio: 22.4 },
                { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', price: 1120.00, changePercent: 0.77, volume: 3800000, marketCap: 780000000000, peRatio: 18.2 },
                { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', price: 780.00, changePercent: 1.99, volume: 6500000, marketCap: 700000000000, peRatio: 15.6 },
                { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', price: 1450.00, changePercent: 1.45, volume: 2800000, marketCap: 820000000000, peRatio: 35.2 },
                { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking', price: 1950.00, changePercent: -0.35, volume: 2100000, marketCap: 385000000000, peRatio: 24.8 },
                { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG', price: 2650.00, changePercent: 0.55, volume: 1800000, marketCap: 620000000000, peRatio: 58.5 },
                { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG', price: 450.00, changePercent: 0.85, volume: 4200000, marketCap: 560000000000, peRatio: 25.2 },
                { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', price: 3250.00, changePercent: 1.75, volume: 1500000, marketCap: 440000000000, peRatio: 30.5 },
                { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Banking', price: 1050.00, changePercent: -0.45, volume: 3200000, marketCap: 320000000000, peRatio: 19.8 },
                { symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'FMCG', price: 2850.00, changePercent: 0.95, volume: 1200000, marketCap: 275000000000, peRatio: 52.3 },
                { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Auto', price: 12500.00, changePercent: 2.15, volume: 850000, marketCap: 395000000000, peRatio: 28.9 },
                { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Pharma', price: 1850.00, changePercent: -1.25, volume: 2100000, marketCap: 445000000000, peRatio: 32.5 },
                { symbol: 'TITAN', name: 'Titan Company', sector: 'FMCG', price: 3650.00, changePercent: 1.55, volume: 950000, marketCap: 325000000000, peRatio: 95.2 },
                { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'Finance', price: 6850.00, changePercent: -2.15, volume: 2800000, marketCap: 405000000000, peRatio: 38.5 },
                { symbol: 'ADANIPORTS', name: 'Adani Ports', sector: 'Infrastructure', price: 1250.00, changePercent: 0.85, volume: 1800000, marketCap: 265000000000, peRatio: 28.2 },
                { symbol: 'NTPC', name: 'NTPC Ltd', sector: 'Energy', price: 385.00, changePercent: 0.45, volume: 5500000, marketCap: 375000000000, peRatio: 15.8 },
                { symbol: 'POWERGRID', name: 'Power Grid Corp', sector: 'Energy', price: 295.00, changePercent: 0.25, volume: 4200000, marketCap: 275000000000, peRatio: 12.5 },
                { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', price: 780.00, changePercent: -1.25, volume: 5200000, marketCap: 285000000000, peRatio: -8.5 },
                { symbol: 'WIPRO', name: 'Wipro Ltd', sector: 'IT', price: 520.00, changePercent: -0.95, volume: 4100000, marketCap: 285000000000, peRatio: 22.8 },
                { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', sector: 'Cement', price: 10500.00, changePercent: 1.15, volume: 650000, marketCap: 305000000000, peRatio: 42.5 },
                { symbol: 'NESTLEIND', name: 'Nestle India', sector: 'FMCG', price: 2450.00, changePercent: 0.35, volume: 850000, marketCap: 237000000000, peRatio: 72.8 },
                { symbol: 'TATASTEEL', name: 'Tata Steel', sector: 'Metal', price: 165.00, changePercent: 2.85, volume: 8500000, marketCap: 200000000000, peRatio: 8.5 },
                { symbol: 'JSWSTEEL', name: 'JSW Steel', sector: 'Metal', price: 920.00, changePercent: 3.15, volume: 4200000, marketCap: 225000000000, peRatio: 12.8 },
                { symbol: 'CIPLA', name: 'Cipla Ltd', sector: 'Pharma', price: 1420.00, changePercent: -0.55, volume: 1800000, marketCap: 182000000000, peRatio: 28.5 },
                { symbol: 'DRREDDY', name: "Dr. Reddy's Labs", sector: 'Pharma', price: 6850.00, changePercent: 0.75, volume: 420000, marketCap: 114000000000, peRatio: 18.2 },
                { symbol: 'ADANI', name: 'Adani Enterprises', sector: 'Conglomerate', price: 3150.00, changePercent: 1.85, volume: 3500000, marketCap: 345000000000, peRatio: 85.5 },
                { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', sector: 'Finance', price: 1650.00, changePercent: -1.45, volume: 1500000, marketCap: 265000000000, peRatio: 32.8 }
            ];
        }
        
        await Promise.all([
            loadIndices(),
            loadGainers(),
            loadLosers(),
            loadVolume(),
            loadVolatile(),
            loadTrending()
        ]);
        console.log('Market data loaded');
    }

    function setupAutoRefresh() {
        refreshTimers.forEach(timer => clearInterval(timer));
        refreshTimers = [];
        const refreshTimer = setInterval(() => {
            console.log('Auto-refreshing market data...');
            checkMarketStatus();
            updateScreenerMarketData(); // Update ticker data
            loadAllData();
        }, REFRESH_INTERVAL);
        refreshTimers.push(refreshTimer);
    }

    function setupCategoryTabs() {
        const tabs = document.querySelectorAll('.category-tab');
        if (!tabs.length) {
            return;
        }

        const activeTab = document.querySelector('.category-tab.active');
        const initialCategory = activeTab?.getAttribute('data-category') || tabs[0].getAttribute('data-category') || 'indices';

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const category = tab.getAttribute('data-category');
                switchCategory(category);
            });
        });

        switchCategory(initialCategory);
    }

    // ---------------- MARKET TICKER ----------------

    // Mock market data for screener page
    const screenerMarketData = [
        { symbol: 'NIFTY 50', value: 22450.75, changePercent: 1.25 },
        { symbol: 'SENSEX', value: 73890.45, changePercent: 0.95 },
        { symbol: 'BANKNIFTY', value: 47230.8, changePercent: -0.45 },
        { symbol: 'USDINR', value: 83.25, changePercent: 0.15 },
        { symbol: 'GOLD', value: 6850, changePercent: 0.85 },
        { symbol: 'CRUDE', value: 5420, changePercent: -1.2 }
    ];

    function formatTickerValue(item) {
        if (item.symbol === 'USDINR') {
            return item.value.toFixed(2);
        }

        if (item.symbol === 'GOLD' || item.symbol === 'CRUDE') {
            return Math.round(item.value).toLocaleString('en-IN');
        }

        return item.value.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function formatTickerChange(changePercent) {
        const sign = changePercent >= 0 ? '+' : '';
        return `${sign}${changePercent.toFixed(2)}%`;
    }

    function createScreenerMarketTickerItem(data) {
        const changeClass = data.changePercent >= 0 ? 'positive' : 'negative';
        return `
            <div class="market-item">
                <span class="market-symbol">${data.symbol}</span>
                <span class="market-price">${formatTickerValue(data)}</span>
                <span class="market-change ${changeClass}">${formatTickerChange(data.changePercent)}</span>
            </div>
        `;
    }

    function renderScreenerMarketTicker() {
        const tickerContent = document.getElementById('screener-ticker-content');
        if (!tickerContent) return;

        const tickerItems = screenerMarketData.map(createScreenerMarketTickerItem).join('');

        tickerContent.innerHTML = tickerItems + tickerItems;
    }

    function updateScreenerMarketData() {
        screenerMarketData.forEach(item => {
            const delta = (Math.random() - 0.5) * 0.4;
            item.changePercent = Number((item.changePercent + delta).toFixed(2));
            item.value = Number((item.value * (1 + delta / 100)).toFixed(2));
        });

        renderScreenerMarketTicker();
    }

    // Stock Search Functionality
    function initializeStockSearch() {
        if (!elements.stockSearchInput || !elements.searchDropdown || !elements.dropdownContent) return;

        elements.stockSearchInput.addEventListener('input', handleSearchInput);
        elements.stockSearchInput.addEventListener('focus', showDropdown);
        elements.stockSearchInput.addEventListener('blur', hideDropdown);

        // Prevent dropdown from closing when clicking inside it
        elements.searchDropdown.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.stockSearchInput.contains(e.target) && !elements.searchDropdown.contains(e.target)) {
                hideDropdown();
            }
        });
    }

    function handleSearchInput(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            hideDropdown();
            return;
        }

        const localSuggestions = getAutocompleteSuggestions(query);
        if (localSuggestions.length > 0) {
            renderSearchResults(localSuggestions);
            showDropdown();
        } else {
            hideDropdown();
        }

        // Debounce the search to avoid too many API calls
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    }

    async function performSearch(query) {
        try {
            const response = await fetch(`${BASE_API_URL}/api/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const results = await response.json();
            const stockResults = (results || []).filter(item => (item.type || 'Stock') === 'Stock');
            
            if (stockResults.length > 0) {
                renderSearchResults(stockResults);
                showDropdown();
            } else {
                hideDropdown();
            }
        } catch (error) {
            console.error('Search API error:', error);
            // Fallback to local search if API fails
            const filteredResults = fallbackSearchData.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.symbol.toLowerCase().includes(query)
            );
            
            if (filteredResults.length > 0) {
                renderSearchResults(filteredResults);
                showDropdown();
            } else {
                hideDropdown();
            }
        }
    }

    function renderSearchResults(results) {
        const html = results.map(item => `
            <div class="search-result-item" data-symbol="${item.symbol}" data-type="${item.type || 'Stock'}">
                <div class="search-result-info">
                    <div class="search-result-name">${item.name}</div>
                    <div class="search-result-meta">Equity</div>
                </div>
                <div class="search-result-symbol">${item.symbol}</div>
            </div>
        `).join('');

        elements.dropdownContent.innerHTML = html;

        // Add click handlers to result items
        elements.dropdownContent.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const symbol = item.dataset.symbol;
                const type = item.dataset.type;
                handleSearchResultClick(symbol, type);
            });
        });
    }

    function handleSearchResultClick(symbol, type) {
        if (type === 'Stock') {
            elements.stockSearchInput.value = symbol;
            hideDropdown();
            handleStockClick(symbol);
        } else if (type === 'Index') {
            elements.stockSearchInput.value = '';
            hideDropdown();
        }
    }

    function showDropdown() {
        if (elements.searchDropdown) {
            elements.searchDropdown.style.display = 'block';
        }
    }

    function hideDropdown() {
        if (elements.searchDropdown) {
            elements.searchDropdown.style.display = 'none';
        }
    }

    function setupCollapsibleTableSections() {
        document.querySelectorAll('[data-collapsible-card]').forEach((card) => {
            const toggle = card.querySelector('[data-collapsible-toggle]');
            const icon = card.querySelector('.collapse-icon');

            if (!toggle || !icon) return;

            const updateState = () => {
                const expanded = !card.classList.contains('is-collapsed');
                toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                icon.textContent = expanded ? '▼' : '▶';
            };

            const handleToggle = () => {
                card.classList.toggle('is-collapsed');
                card.classList.toggle('is-expanded', !card.classList.contains('is-collapsed'));
                updateState();
            };

            updateState();

            toggle.addEventListener('click', handleToggle);
            toggle.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleToggle();
                }
            });
        });
    }

    function makeTableRowsClickable() {
        return;
    }

    function init() {
        console.log('Initializing FinEdu Screener...');
        checkMarketStatus();
        renderSectorPerformance();
        
        renderScreenerMarketTicker();
        
        setupCategoryTabs();
        initETFSorting();
        setupStockFilters();
        setupTableSorting(); // Initialize table sorting
        setupTableFiltering(); // Initialize table filtering
        setupCollapsibleTableSections();
        setupWatchlist(); // Initialize watchlist functionality
        initializeStockSearch(); // Initialize stock search
        initFuturesDashboard(); // Initialize futures-only dashboard interactions
        initForexDashboard(); // Initialize forex-only dashboard interactions
        
        // Setup ETF filter and search listeners
        const categoryFilter = document.getElementById('etfCategoryFilter');
        const etfSearch = document.getElementById('etfSearch');
        if (categoryFilter) categoryFilter.addEventListener('change', filterETFs);
        if (etfSearch) etfSearch.addEventListener('input', filterETFs);
        
        loadAllData();
        setupAutoRefresh();
        console.log('FinEdu Screener initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('beforeunload', () => {
        refreshTimers.forEach(timer => clearInterval(timer));
    });

})();
