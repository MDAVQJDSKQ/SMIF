import React, { useState } from 'react';
import ApiKeyInput from './ApiKeyInput';
import DataCategories from './DataCategories';
import Results from './Results';
import { fetchData } from '../utils/api';
import { processData } from '../utils/dataProcessing';

function FMPScraper() {
    const [selectedRatios, setSelectedRatios] = useState([]);
    const [ticker, setTicker] = useState('');
    const [years, setYears] = useState(5);
    const [frequency, setFrequency] = useState('annual');
    const [results, setResults] = useState([]);

    const handleCheckboxChange = (e) => {
        const item = e.target.value;
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedRatios(prev => [...prev, item]);
        } else {
            setSelectedRatios(prev => prev.filter(ratio => ratio !== item));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Fetch data and update results
        // You'll need to implement this function
        fetchDataAndUpdateResults(ticker, years, frequency, selectedRatios);
    };

    const fetchDataAndUpdateResults = async (ticker, years, frequency, selectedRatios) => {
        const apiKey = localStorage.getItem('fmpApiKey');
        if (!apiKey) {
            alert('Please enter your API key first.');
            return;
        }

        try {
            const data = await Promise.all(selectedRatios.map(item => 
                fetchData(item, ticker, frequency, years, apiKey)
            ));
            console.log('Fetched data:', data); // Debug log
            const processedData = data.map((d, i) => {
                console.log(`Processing ${selectedRatios[i]}:`, d); // Debug log
                return processData(selectedRatios[i], d);
            });
            setResults(processedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again.');
        }
    };

    return (
        <div className="container">
            <h1>FMP Scraper</h1>
            <ApiKeyInput />
            <form onSubmit={handleSubmit} className="scraper-form">
                <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    placeholder="Enter stock ticker"
                    required
                />
                <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                    min="1"
                    max="30"
                    required
                />
                <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                >
                    <option value="annual">Annual</option>
                    <option value="quarterly">Quarterly</option>
                </select>
                <button type="submit">Scrape Data</button>
            </form>
            <DataCategories 
                selectedRatios={selectedRatios} 
                handleCheckboxChange={handleCheckboxChange}
            />
            <Results selectedRatios={selectedRatios} />
        </div>
    );
}

export default FMPScraper;
