const API_BASE_URL = 'https://financialmodelingprep.com/api/v3';

let dataCache = {};

export async function fetchData(item, ticker, frequency, timeRange, apiKey) {
    const cacheKey = `${item}_${ticker}_${frequency}_${timeRange}`;
    if (dataCache[cacheKey]) {
        return dataCache[cacheKey];
    }

    let endpoint;
    switch (item) {
        case 'incomeStatement':
        case 'incomeStatementCondensed':
            endpoint = 'income-statement';
            break;
        case 'balanceSheet':
        case 'balanceSheetCondensed':
            endpoint = 'balance-sheet-statement';
            break;
        case 'cashFlow':
        case 'cashFlowCondensed':
            endpoint = 'cash-flow-statement';
            break;
        default:
            endpoint = 'ratios';
    }

    const url = `${API_BASE_URL}/${endpoint}/${ticker}?period=${frequency}&limit=${timeRange}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        dataCache[cacheKey] = data;
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}