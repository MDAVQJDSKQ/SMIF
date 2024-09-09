const API_BASE_URL = 'https://financialmodelingprep.com/api/v3';

let dataCache = {};

export async function fetchData(item, ticker, frequency, timeRange, apiKey) {
    const cacheKey = `${item}_${ticker}_${frequency}_${timeRange}`;
    if (dataCache[cacheKey]) {
        return dataCache[cacheKey];
    }

    let endpoint;
    let dataField = item;

    const incomeStatementItems = ['revenue', 'costOfRevenue', 'grossProfit', 'operatingIncome', 'netIncome'];
    const balanceSheetItems = ['totalAssets', 'totalLiabilities', 'totalEquity', 'cashAndCashEquivalents', 'totalDebt'];
    const cashFlowItems = ['operatingCashFlow', 'capitalExpenditure', 'freeCashFlow', 'dividendsPaid', 'netCashUsedForInvestingActivites'];

    if (incomeStatementItems.includes(item)) {
        endpoint = 'income-statement';
    } else if (balanceSheetItems.includes(item)) {
        endpoint = 'balance-sheet-statement';
    } else if (cashFlowItems.includes(item)) {
        endpoint = 'cash-flow-statement';
    } else {
        endpoint = 'ratios';
    }

    switch (item) {
        case 'debtToEquityRatio':
            dataField = 'debtEquityRatio';
            break;
        case 'interestCoverageRatio':
            dataField = 'interestCoverage';
            break;
        case 'earningsPerShare':
            dataField = 'eps';
            break;
        case 'priceToEarningsRatio':
            dataField = 'peRatio';
            break;
    }

    const url = `${API_BASE_URL}/${endpoint}/${ticker}?period=${frequency}&limit=${timeRange}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        let processedData;
        if (endpoint === 'ratios') {
            processedData = data.map(entry => ({
                date: entry.date,
                value: entry[dataField]
            }));
        } else {
            processedData = data.map(entry => ({
                date: entry.date,
                value: entry[dataField]
            }));
        }
        
        dataCache[cacheKey] = processedData;
        return processedData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}