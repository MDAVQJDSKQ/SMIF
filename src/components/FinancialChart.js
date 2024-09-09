import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AppContext } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FinancialChart() {
  const { chartData } = useContext(AppContext);
  const colorScheme = ['#ffdd80', '#2D2926', '#7F8180', '#A0A2A0', '#B2B4B2'];

  console.log('Chart data in FinancialChart:', chartData);

  const data = {
    labels: [],
    datasets: []
  };

  if (chartData && Object.keys(chartData).length > 0) {
    const firstRatio = Object.keys(chartData)[0];
    data.labels = chartData[firstRatio].map(item => item.date).reverse();

    Object.entries(chartData).forEach(([key, value], index) => {
      console.log(`Processing ${key}:`, value);
      const dataPoints = value.map(item => item.value).reverse();
      console.log(`Data points for ${key}:`, dataPoints);
      data.datasets.push({
        label: key,
        data: dataPoints,
        backgroundColor: colorScheme[index % colorScheme.length],
      });
    });
  }

  console.log('Processed chart data:', data);

  const formatYAxisTick = (value) => {
    if (Math.abs(value) >= 1e9) {
      return '$' + (value / 1e9).toFixed(1) + 'B';
    } else if (Math.abs(value) >= 1e6) {
      return '$' + (value / 1e6).toFixed(1) + 'M';
    } else {
      return '$' + value.toFixed(0);
    }
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: formatYAxisTick
        }
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default FinancialChart;