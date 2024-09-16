import { calculate_condensed_income_statement, calculate_condensed_balance_sheet, calculate_condensed_cash_flow } from './dataProcessing';

const API_BASE_URL = 'https://financialmodelingprep.com/api/v3';

let dataCache = {};

export async function fetchData(endpoint, ticker, frequency, timeRange, apiKey, additionalParams = {}) {
    const { year, quarter } = additionalParams;
    const baseUrl = 'https://financialmodelingprep.com/api/v3';
    
    let url = `${baseUrl}/${endpoint}?apikey=${apiKey}`;

    if (endpoint.includes('earning_call_transcript')) {
        if (!year || !quarter) {
            throw new Error('Year and quarter are required for earnings call transcripts');
        }
        url = `${baseUrl}/earning_call_transcript/${ticker}?year=${year}&quarter=${quarter}&apikey=${apiKey}`;
    } else {
        url = `${baseUrl}/${endpoint}/${ticker}?period=${frequency}&limit=${timeRange}&apikey=${apiKey}`;
    }

    console.log('Fetching data from URL:', url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received data:', data);
        return data;
    } catch (error) {
        console.error('Error in fetchData:', error);
        throw error;
    }
}