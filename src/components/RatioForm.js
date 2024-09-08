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
		} catch (error) {
			console.error('Error fetching data:', error);
			alert('An error occurred while fetching data. Please try again.');
		}
	};

	const handleCheckboxChange = async (e) => {
		const item = e.target.value;
		const isChecked = e.target.checked;

		if (isChecked) {
			setSelectedRatios(prev => [...prev, item]);
			try {
				const apiKey = localStorage.getItem('fmpApiKey');
				const data = await fetchData(item, ticker, frequency.toLowerCase(), timeRange.split(' ')[0], apiKey);
				const processedData = processData(item, data);
				setChartData(prev => ({...prev, [item]: processedData}));
			} catch (error) {
				console.error('Error fetching data:', error);
				alert('An error occurred while fetching data. Please try again.');
			}
		} else {
			setSelectedRatios(prev => prev.filter(ratio => ratio !== item));
			setChartData(prev => {
				const newData = {...prev};
				delete newData[item];
				return newData;
			});
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
