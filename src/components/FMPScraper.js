import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
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

    const { setTableData } = useContext(AppContext);

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
        fetchDataAndUpdateResults(ticker, years, frequency, selectedRatios);
    };

    const handleDownloadCSV = () => {
        if (results.length === 0) {
            alert('No data to download. Please scrape data first.');
            return;
        }

        const headers = ['Item', ...results.map(row => row.date)];
        let csvContent = headers.join(',') + '\n';

        const transposedData = Object.keys(results[0])
            .filter(key => key !== 'date')
            .map(key => {
                const row = [key, ...results.map(item => item[key] || '')];
                return row.map(value => typeof value === 'string' ? `"${value}"` : value).join(',');
            });

        csvContent += transposedData.join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${ticker}_financial_data.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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
            console.log('Fetched data:', data);
            const processedData = selectedRatios.reduce((acc, ratio, index) => {
                const ratioData = data[index];
                if (Array.isArray(ratioData)) {
                    ratioData.forEach(item => {
                        const date = item.date;
                        if (!acc[date]) acc[date] = { date };
                        if (ratio.includes('Statement') || ratio.includes('Sheet') || ratio.includes('Flow')) {
                            Object.entries(item).forEach(([key, value]) => {
                                if (key !== 'date' && !['symbol', 'reportedCurrency', 'cik', 'fillingDate', 'acceptedDate', 'calendarYear', 'period', 'link', 'finalLink'].includes(key)) {
                                    acc[date][key] = value;
                                }
                            });
                        } else {
                            acc[date][ratio] = item[ratio] || item.value;
                        }
                    });
                }
                return acc;
            }, {});
            const tableData = Object.values(processedData).sort((a, b) => new Date(b.date) - new Date(a.date));
            setResults(tableData);
            setTableData(tableData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="scraper-content">
                <div className="scraper-header">
                    <h1>FMP Scraper</h1>
                    <h5>Data provided by Financial Modeling Prep</h5>
                </div>
                <div className="scraper-container">
                    <div className="scraper-left">
                        <div className="api-section">
                            <ApiKeyInput />
                            <div className="ticker-input">
                                <input
                                    type="text"
                                    value={ticker}
                                    onChange={(e) => setTicker(e.target.value)}
                                    placeholder="Enter stock ticker"
                                    required
                                />
                            </div>
                            <div className="time-frequency-input">
                                <input
                                    type="number"
                                    value={years}
                                    onChange={(e) => setYears(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                                    min="1"
                                    max="30"
                                    placeholder="Years"
                                    required
                                />
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                >
                                    <option value="annual">Annual</option>
                                    <option value="quarterly">Quarterly</option>
                                </select>
                            </div>
                        </div>
                        <DataCategories 
                            selectedRatios={selectedRatios} 
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    </div>
                    <div className="scraper-right">
                        <div className="scraper-actions">
                            <button onClick={handleSubmit}>Scrape Data</button>
                            <button onClick={handleDownloadCSV}>Download CSV</button>
                        </div>
                        <Results />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FMPScraper;
