import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AppContext } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FinancialChart() {
  const { chartData } = useContext(AppContext);
  const colorScheme = ['#ffdd80', '#2D2926', '#7F8180', '#A0A2A0', '#B2B4B2'];

  if (!chartData || Object.keys(chartData).length === 0) {
    return <div>No data available for chart</div>;
  }

  const data = {
    labels: Object.keys(chartData)[0] ? chartData[Object.keys(chartData)[0]].map(item => item.date) : [],
    datasets: Object.entries(chartData).map(([key, value], index) => ({
      label: key,
      data: value.map(item => item[key]),
      backgroundColor: colorScheme[index % colorScheme.length],
    })),
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default FinancialChart;