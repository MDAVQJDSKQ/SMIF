import React, { useState, useContext } from 'react';
import DataCategories from './DataCategories';
import { AppContext } from '../context/AppContext';
import { fetchData } from '../utils/api';
import { processData } from '../utils/dataProcessing';

function RatioForm() {
	const { setChartData, setTableData } = useContext(AppContext);
	const [ticker, setTicker] = useState('');
	const [frequency, setFrequency] = useState('Annual');
	const [timeRange, setTimeRange] = useState('5 Years');
	const [selectedRatios, setSelectedRatios] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const apiKey = localStorage.getItem('fmpApiKey');
		if (!apiKey) {
			alert('Please enter your API key first.');
			return;
		}

		try {
			const data = await Promise.all(selectedRatios.map(item => 
				fetchData(item, ticker, frequency.toLowerCase(), timeRange.split(' ')[0], apiKey)
			));
			const processedData = data.map((d, i) => processData(selectedRatios[i], d));
			setTableData(processedData);
			setChartData(prev => {
				const newData = {...prev};
				selectedRatios.forEach((ratio, index) => {
					newData[ratio] = processedData[index];
				});
				return newData;
			});
		} catch (error) {
			console.error('Error fetching data:', error);
			alert('An error occurred while fetching data. Please try again.');
		}
	};

	const handleCheckboxChange = async (e) => {
		const item = e.target.value;
		const isChecked = e.target.checked;
		console.log(`Checkbox changed: ${item}, isChecked: ${isChecked}`);

		if (isChecked && selectedRatios.length < 5) {
			setSelectedRatios(prev => {
				console.log(`Adding ${item} to selectedRatios`);
				return [...prev, item];
			});
			console.log(`Fetching data for ${item}`);
			await fetchDataAndUpdateChart(ticker, timeRange.split(' ')[0], [item]);
		} else if (!isChecked) {
			setSelectedRatios(prev => {
				console.log(`Removing ${item} from selectedRatios`);
				return prev.filter(ratio => ratio !== item);
			});
			setChartData(prev => {
				console.log(`Removing ${item} from chartData`);
				const newData = {...prev};
				delete newData[item];
				return newData;
			});
		} else {
			alert('You can select up to 5 variables.');
		}
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
				<div className="time-range-input">
					<input
						type="number"
						value={timeRange.split(' ')[0]}
						onChange={(e) => {
							const value = Math.min(Math.max(parseInt(e.target.value) || 1, 1), 30);
							setTimeRange(`${value} Years`);
						}}
						min="1"
						max="30"
						required
					/>
					<span>Years</span>
				</div>
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
