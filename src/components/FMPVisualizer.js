import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ApiKeyInput from './ApiKeyInput';
import VisualizerDataCategories from './VisualizerDataCategories';
import FinancialChart from './FinancialChart';
import { fetchData, processData } from '../utils/api';

function FMPVisualizer() {
    const { setChartData } = useContext(AppContext);
    const [selectedRatios, setSelectedRatios] = useState([]);
    const [ticker, setTicker] = useState('');
    const [years, setYears] = useState(5);

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
        // Fetch data and update chart
        // You'll need to implement this function
        fetchDataAndUpdateChart(ticker, years, selectedRatios, setChartData);
    };

    const fetchDataAndUpdateChart = async (ticker, years, selectedRatios) => {
        const apiKey = localStorage.getItem('fmpApiKey');
        if (!apiKey) {
            alert('Please enter your API key first.');
            return;
        }

        try {
            const data = await Promise.all(selectedRatios.map(item => 
                fetchData(item, ticker, 'annual', years, apiKey)
            ));
            const processedData = data.map((d, i) => processData(selectedRatios[i], d));
            setChartData(processedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again.');
        }
    };

    return (
        <div className="container">
            <h1>FMP Visualizer</h1>
            <ApiKeyInput />
            <form onSubmit={handleSubmit} className="visualizer-form">
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
                <button type="submit">Visualize</button>
            </form>
            <VisualizerDataCategories 
                selectedRatios={selectedRatios}
                handleCheckboxChange={handleCheckboxChange}
            />
            <FinancialChart />
        </div>
    );
}

export default FMPVisualizer;