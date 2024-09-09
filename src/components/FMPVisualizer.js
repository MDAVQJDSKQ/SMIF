import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import ApiKeyInput from './ApiKeyInput';
import VisualizerDataCategories from './VisualizerDataCategories';
import FinancialChart from './FinancialChart';
import { fetchData } from '../utils/api';
import { processData } from '../utils/dataProcessing';

function FMPVisualizer() {
    const { setChartData } = useContext(AppContext);
    const [selectedRatios, setSelectedRatios] = useState([]);
    const [ticker, setTicker] = useState('');
    const years = 5; // Set a constant value for years

    const handleCheckboxChange = async (e) => {
        const item = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked && selectedRatios.length < 5) {
            setSelectedRatios(prev => [...prev, item]);
            await fetchDataAndUpdateChart(ticker, years, [item], setChartData);
        } else if (!isChecked) {
            setSelectedRatios(prev => prev.filter(ratio => ratio !== item));
            setChartData(prev => {
                const newData = {...prev};
                delete newData[item];
                return newData;
            });
        } else {
            alert('You can select up to 5 variables.');
        }
    };

    const fetchDataAndUpdateChart = async (ticker, years, selectedRatios, setChartData) => {
        const apiKey = localStorage.getItem('fmpApiKey');
        if (!apiKey) {
            alert('Please enter your API key first.');
            return;
        }

        try {
            const data = await Promise.all(selectedRatios.map(item => 
                fetchData(item, ticker, 'annual', years, apiKey)
            ));
            console.log('Fetched data:', data);
            setChartData(prev => {
                const newData = {...prev};
                selectedRatios.forEach((ratio, index) => {
                    newData[ratio] = data[index];
                });
                console.log('Updated chart data:', newData);
                return newData;
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again.');
        }
    };

    useEffect(() => {
        return () => {
            setChartData({});
        };
    }, [setChartData]);

    return (
        <div className="container">
            <h1>FMP Visualizer</h1>
            <div className="visualizer-container">
                <div className="visualizer-left">
                    <ApiKeyInput />
                    <div className="visualizer-form">
                        <input
                            type="text"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value)}
                            placeholder="Enter stock ticker"
                            required
                        />
                    </div>
                    <VisualizerDataCategories 
                        selectedRatios={selectedRatios}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                </div>
                <div className="visualizer-right">
                    <FinancialChart />
                </div>
            </div>
        </div>
    );
}

export default FMPVisualizer;