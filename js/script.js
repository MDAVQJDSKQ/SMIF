
document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');
    const form = document.getElementById('ratioForm');
    const resultsDiv = document.getElementById('results');
    const frequencyDropdown = document.querySelector('.ticker.frequency-choice');
    const timeRangeDropdown = document.querySelector('.ticker.time-range');

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

    // Setup dropdown functionality
    function setupDropdown(dropdown) {
        const button = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');
        const span = dropdown.querySelector('span');

        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });

        content.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                span.textContent = e.target.textContent;
                content.style.display = 'none';
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            content.style.display = 'none';
        });
    }

    // Initialize dropdowns
    setupDropdown(frequencyDropdown);
    setupDropdown(timeRangeDropdown);

    async function fetchAndDisplayRatios() {
        const apiKey = localStorage.getItem('fmpApiKey');
        if (!apiKey) {
            alert('Please save your API key first.');
            return;
        }
    
        const ticker = document.getElementById('ticker').value.toUpperCase();
        const selectedItems = Array.from(document.querySelectorAll('input[name="ratios"]:checked')).map(el => el.value);
        const frequency = document.querySelector('.ticker.frequency-choice span').textContent.toLowerCase();
        const originalTimeRange = document.querySelector('.ticker.time-range span').textContent.split(' ')[0];
        let timeRange = originalTimeRange;
        
        // Adjust timeRange for quarterly data
        if (frequency === 'quarterly') {
            timeRange = parseInt(timeRange) * 4;
        }
        
        if (selectedItems.length === 0) {
            alert('Please select at least one item.');
            return;
        }
    
        resultsDiv.innerHTML = '<p>Loading...</p>';
    
        try {
            let data = [];
            let condensedData = [];
            let headers = ['Item'];  // Changed from 'Date' to 'Item' for transposed data
    
            // Fetch data for each selected item
            for (const item of selectedItems) {
                let endpoint;
                switch (item) {
                    case 'incomeStatement':
                    case 'incomeStatementCondensed':
                        endpoint = `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?period=${frequency}&limit=${timeRange}&apikey=${apiKey}`;
                        break;
                    case 'balanceSheet':
                    case 'balanceSheetCondensed':
                        endpoint = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?period=${frequency}&limit=${timeRange}&apikey=${apiKey}`;
                        break;
                    case 'cashFlow':
                    case 'cashFlowCondensed':
                        endpoint = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${ticker}?period=${frequency}&limit=${timeRange}&apikey=${apiKey}`;
                        break;
                    default:
                        endpoint = `https://financialmodelingprep.com/api/v3/ratios/${ticker}?period=${frequency}&limit=${timeRange}&apikey=${apiKey}`;
                }
    
                const response = await fetch(endpoint);
                const itemData = await response.json();
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                if (itemData.length === 0) {
                    alert(`No data found for ${item}.`);
                    continue;
                }
    
                // Calculate condensed versions if selected
                let processedData = itemData;
                if (item === 'incomeStatementCondensed') {
                    processedData = itemData.map(entry => calculate_condensed_income_statement(entry));
                } else if (item === 'balanceSheetCondensed') {
                    processedData = itemData.map(entry => calculate_condensed_balance_sheet(entry));
                } else if (item === 'cashFlowCondensed') {
                    processedData = itemData.map(entry => calculate_condensed_cash_flow(entry));
                }
    
                // Add dates to headers
                processedData.forEach(entry => {
                    if (!headers.includes(entry.date)) {
                        headers.push(entry.date);
                    }
                });
    
                
                // Populate data
                let targetData = item.includes('Condensed') ? condensedData : data;
                processedData.forEach(entry => {
                    if (item.includes('Statement') || item.includes('Sheet') || item.includes('Flow')) {
                        // For financial statements, process all items
                        Object.keys(entry).forEach(key => {
                            if (key !== 'date' && !['symbol', 'reportedCurrency', 'cik', 'fillingDate', 'acceptedDate','calendarYear','period', 'link', 'finalLink'].includes(key)) {
                                let row = targetData.find(r => r.Item === key);
                                if (!row) {
                                    row = { Item: key };
                                    targetData.push(row);
                                }
                                row[entry.date] = entry[key] || 'N/A';
                            }
                        });
                    } else {
                        // For ratios, only process the selected item
                        if (entry.hasOwnProperty(item)) {
                            let row = targetData.find(r => r.Item === item);
                            if (!row) {
                                row = { Item: item };
                                targetData.push(row);
                            }
                            row[entry.date] = entry[item] || 'N/A';
                        }
                    }
                });
            }
    
            // Merge condensed data into main data array
            data = [...data, ...condensedData];
    
            // Prepare CSV and HTML content
            let csvContent = headers.join(',') + '\n';
            let htmlContent = `<h2>Selected Data for ${ticker} (${frequency}, ${originalTimeRange} years)</h2><table><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>`;
    
            data.forEach(row => {
                let rowData = headers.map(header => row[header] || 'N/A');
                csvContent += rowData.join(',') + '\n';
                htmlContent += `<tr>${rowData.map(value => `<td>${value}</td>`).join('')}</tr>`;
            });
    
            htmlContent += '</table>';
            resultsDiv.innerHTML = htmlContent;
    
            // Create and add download link for CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `${ticker}_${frequency}_${originalTimeRange}yr_data.csv`;
            downloadLink.textContent = 'Download CSV';
            downloadLink.className = 'download-btn';
            resultsDiv.appendChild(downloadLink);
    
        } catch (error) {
            console.error('Error:', error);
            resultsDiv.innerHTML = '<p>An error occurred while fetching the data. Please check your API key and try again.</p>';
        }
    }

    // Form submission event
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        fetchAndDisplayRatios();
    });
});

function calculate_condensed_income_statement(data) {
    return {
        revenue: data.revenue,
        costOfRevenue: data.costOfRevenue,
        grossProfit: data.revenue - data.costOfRevenue,
        operatingExpenses: data.researchAndDevelopmentExpenses + data.sellingGeneralAndAdministrativeExpenses,
        operatingIncome: data.revenue - data.costOfRevenue - (data.researchAndDevelopmentExpenses + data.sellingGeneralAndAdministrativeExpenses),
        netInterest: data.interestIncome - data.interestExpense,
        incomeBeforeTax: data.incomeBeforeTax,
        incomeTaxExpense: data.incomeTaxExpense,
        netIncome: data.incomeBeforeTax - data.incomeTaxExpense,
        eps: data.weightedAverageShsOut > 0 ? (data.incomeBeforeTax - data.incomeTaxExpense) / data.weightedAverageShsOut : 'N/A',
        date: data.date
    };
}

function calculate_condensed_balance_sheet(data) {
    return {
        cashAndShortTermInvestments: data.cashAndShortTermInvestments,
        accountsReceivable: data.netReceivables,
        inventory: data.inventory,
        totalCurrentAssets: data.totalCurrentAssets,
        propertyPlantEquipmentNet: data.propertyPlantEquipmentNet,
        longTermInvestments: data.longTermInvestments,
        totalAssets: data.totalAssets,
        accountsPayable: data.accountPayables,
        shortTermDebt: data.shortTermDebt,
        totalCurrentLiabilities: data.totalCurrentLiabilities,
        longTermDebt: data.longTermDebt,
        totalLiabilities: data.totalLiabilities,
        totalStockholdersEquity: data.totalStockholdersEquity,
        totalLiabilitiesAndEquity: data.totalLiabilitiesAndStockholdersEquity,
        date: data.date
    };
}

function calculate_condensed_cash_flow(data) {
    return {
        netIncome: data.netIncome,
        depreciationAndAmortization: data.depreciationAndAmortization,
        changesInWorkingCapital: data.changeInWorkingCapital,
        netCashFromOperatingActivities: data.netCashProvidedByOperatingActivities,
        capitalExpenditures: data.investmentsInPropertyPlantAndEquipment,
        netCashFromInvestingActivities: data.netCashUsedForInvestingActivites,
        netCashFromFinancingActivities: data.netCashUsedProvidedByFinancingActivities,
        netChangeInCash: data.netChangeInCash,
        cashAtBeginningOfPeriod: data.cashAtBeginningOfPeriod,
        cashAtEndOfPeriod: data.cashAtEndOfPeriod,
        date: data.date
    };
}
