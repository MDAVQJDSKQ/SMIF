document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');
    const form = document.getElementById('ratioForm');
    const resultsDiv = document.getElementById('results');

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

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const apiKey = localStorage.getItem('fmpApiKey');
        if (!apiKey) {
            alert('Please save your API key first.');
            return;
        }

        const ticker = document.getElementById('ticker').value.toUpperCase();
        const selectedRatios = Array.from(document.querySelectorAll('input[name="ratios"]:checked')).map(el => el.value);
        
        if (selectedRatios.length === 0) {
            alert('Please select at least one ratio.');
            return;
        }

        resultsDiv.innerHTML = '<p>Loading...</p>';

        try {
            const response = await fetch(`https://financialmodelingprep.com/api/v3/ratios/${ticker}?period=annual&apikey=${apiKey}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (data.length === 0) {
                resultsDiv.innerHTML = '<p>No data found for the given ticker.</p>';
                return;
            }

            let csvContent = 'Date,' + selectedRatios.join(',') + '\n';
            let htmlContent = `<h2>Selected Ratios for ${ticker}</h2><table><tr><th>Date</th>${selectedRatios.map(ratio => `<th>${ratio}</th>`).join('')}</tr>`;

            data.forEach(item => {
                let rowData = [item.date];
                selectedRatios.forEach(ratio => {
                    rowData.push(item[ratio] || 'N/A');
                });
                csvContent += rowData.join(',') + '\n';
                htmlContent += `<tr>${rowData.map(value => `<td>${value}</td>`).join('')}</tr>`;
            });

            htmlContent += '</table>';
            resultsDiv.innerHTML = htmlContent;

            // Create and trigger download of CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `${ticker}_ratios.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error:', error);
            resultsDiv.innerHTML = '<p>An error occurred while fetching the data. Please check your API key and try again.</p>';
        }
    });
});
