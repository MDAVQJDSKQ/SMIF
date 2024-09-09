import React, { useState, useContext } from 'react';
import DataCategories from './DataCategories';
import { AppContext } from '../context/AppContext';
import { fetchData } from '../utils/api';
import { processData } from '../utils/dataProcessing';

function RatioForm() {
    const [ticker, setTicker] = useState('');
    const [frequency, setFrequency] = useState('Annual');
    const [selectedRatios, setSelectedRatios] = useState([]);
    const { setChartData } = useContext(AppContext);

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
        fetchDataAndUpdateChart(ticker, 5, selectedRatios);
    };

    const fetchDataAndUpdateChart = async (ticker, years, selectedRatios) => {
        console.log(`fetchDataAndUpdateChart called with: ticker=${ticker}, years=${years}, selectedRatios=${selectedRatios}`);
        const apiKey = localStorage.getItem('fmpApiKey');
        if (!apiKey) {
            alert('Please enter your API key first.');
            return;
        }

        try {
            const data = await Promise.all(selectedRatios.map(item => 
                fetchData(item, ticker, frequency.toLowerCase(), years, apiKey)
            ));
            console.log(`Data fetched:`, data);
            setChartData(prev => {
                const newData = {...prev};
                selectedRatios.forEach((ratio, index) => {
                    console.log(`Processing data for ${ratio}:`, data[index]);
                    newData[ratio] = data[index].map(item => ({
                        date: item.date,
                        value: item[ratio] || item.value || 0
                    }));
                    console.log(`Processed data for ${ratio}:`, newData[ratio]);
                });
                console.log(`New chartData:`, newData);
                return newData;
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-row">
                <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    placeholder="Enter stock ticker"
                    required
                />
                <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                >
                    <option value="Annual">Annual</option>
                    <option value="Quarterly">Quarterly</option>
                </select>
            </div>
            <DataCategories 
                selectedRatios={selectedRatios} 
                handleCheckboxChange={handleCheckboxChange}
            />
            <button type="submit">Get Ratios</button>
        </form>
    );
}

export default RatioForm;
