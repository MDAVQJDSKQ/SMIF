import { calculate_condensed_income_statement, calculate_condensed_balance_sheet, calculate_condensed_cash_flow } from './dataProcessing';

const API_BASE_URL = 'https://financialmodelingprep.com/api/v3';

let dataCache = {};

export async function fetchData(item, ticker, frequency, timeRange, apiKey) {
    const cacheKey = `${item}_${ticker}_${frequency}_${timeRange}`;
    if (dataCache[cacheKey]) {
        return dataCache[cacheKey];
    }

    let endpoint;

    if (item.includes('incomeStatement')) {
        endpoint = 'income-statement';
    } else if (item.includes('balanceSheet')) {
        endpoint = 'balance-sheet-statement';
    } else if (item.includes('cashFlow')) {
        endpoint = 'cash-flow-statement';
    } else {
        endpoint = 'ratios';
    }

    const url = `https://financialmodelingprep.com/api/v3/${endpoint}/${ticker}?period=${frequency}&limit=${timeRange}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (item.includes('Condensed')) {
            const condensedData = data.map(entry => {
                if (item.includes('incomeStatement')) {
                    return calculate_condensed_income_statement(entry);
                } else if (item.includes('balanceSheet')) {
                    return calculate_condensed_balance_sheet(entry);
                } else if (item.includes('cashFlow')) {
                    return calculate_condensed_cash_flow(entry);
                }
                return entry;
            });
            dataCache[cacheKey] = condensedData;
            return condensedData;
        }

        dataCache[cacheKey] = data;
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}