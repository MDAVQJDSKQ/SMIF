document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');
    const form = document.getElementById('ratioForm');
    const resultsDiv = document.getElementById('results');
    const checkboxes = document.querySelectorAll('input[name="ratios"]');
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    resultsDiv.appendChild(chartContainer);

    let chartData = {};
    let chart = null;

    // Load API key from localStorage
    apiKeyInput.value = localStorage.getItem('fmpApiKey') || '';

    // Save API key to localStorage
    saveApiKeyButton.addEventListener('click', function() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('fmpApiKey', apiKey);
            alert('API key saved successfully!');
        } else {
            alert('Please enter a valid API key.');
        }
    });

    async function fetchData(item) {
        const apiKey = localStorage.getItem('fmpApiKey');
        if (!apiKey) {
            alert('Please save your API key first.');
            return null;
        }

        const ticker = document.getElementById('ticker').value.toUpperCase();
        const frequency = document.querySelector('.ticker.frequency-choice span').textContent.toLowerCase();
        const timeRange = document.querySelector('.ticker.time-range span').textContent.split(' ')[0];

        let endpoint;
        switch (item) {
            case 'incomeStatement':
            case 'incomeStatementCondensed':
                endpoint = `income-statement`;
                break;
            case 'balanceSheet':
            case 'balanceSheetCondensed':
                endpoint = `balance-sheet-statement`;
                break;
            case 'cashFlow':
            case 'cashFlowCondensed':
                endpoint = `cash-flow-statement`;
                break;
            default:
                endpoint = `ratios`;
        }

        const url = `https://financialmodelingprep.com/api/v3/${endpoint}/${ticker}?period=${frequency}&limit=${timeRange}&apikey=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    async function handleCheckboxChange(e) {
        const item = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            const data = await fetchData(item);
            if (data) {
                chartData[item] = processData(item, data);
            }
        } else {
            delete chartData[item];
        }

        updateChart();
    }

    function processData(item, data) {
        if (item.includes('Condensed')) {
            switch (item) {
                case 'incomeStatementCondensed':
                    return data.map(entry => calculate_condensed_income_statement(entry));
                case 'balanceSheetCondensed':
                    return data.map(entry => calculate_condensed_balance_sheet(entry));
                case 'cashFlowCondensed':
                    return data.map(entry => calculate_condensed_cash_flow(entry));
            }
        }
        return data;
    }

    function updateChart() {
        const datasets = Object.entries(chartData).map(([key, value], index) => ({
            label: key,
            data: value.map(entry => entry[key] || 'N/A'),
            backgroundColor: getColor(index),
        }));

        const labels = Object.values(chartData)[0]?.map(entry => entry.date) || [];

        if (!chart) {
            chart = new Chart(chartContainer, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            chart.data.labels = labels;
            chart.data.datasets = datasets;
            chart.update();
        }
    }

    function getColor(index) {
        const colors = ['#ffdd80', '#2D2926', '#7F8180', '#A0A2A0', '#B2B4B2'];
        return colors[index % colors.length];
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });

    // Form submission event
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        fetchAndDisplayRatios();
    });

    // Keep the existing fetchAndDisplayRatios function for the table and CSV download
    async function fetchAndDisplayRatios() {
        // ... (keep the existing code for fetching and displaying the table)
    }

    // Expose the handleCheckboxChange function to the global scope
    window.handleCheckboxChange = handleCheckboxChange;
});

// Keep the existing calculate_condensed_* functions
