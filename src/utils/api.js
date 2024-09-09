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
    const balanceSheetItems = ['totalAssets', 'totalLiabilities', 'totalEquity', 'cashAndCashEquivalents', 'totalDebt', 'inventory'];
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
        case 'inventoryTurnover':
            // We'll calculate this manually
            const incomeStatement = await fetchData('costOfRevenue', ticker, frequency, timeRange, apiKey);
            const balanceSheet = await fetchData('inventory', ticker, frequency, timeRange, apiKey);
            const inventoryTurnover = incomeStatement.map((income, index) => {
                const inventory = balanceSheet[index] ? balanceSheet[index].value : 0;
                return {
                    date: income.date,
                    value: inventory !== 0 ? income.value / inventory : 0
                };
            });
            dataCache[cacheKey] = inventoryTurnover;
            return inventoryTurnover;
    }

    const url = `${API_BASE_URL}/${endpoint}/${ticker}?period=${frequency}&limit=${timeRange}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Raw data for ${item}:`, data); // Debug log

        const processedData = data.map(item => {
            const value = item[dataField];
            console.log(`Processed ${dataField}:`, value); // Debug log
            return {
                date: item.date,
                value: value
            };
        });

        dataCache[cacheKey] = processedData;
        return processedData;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}