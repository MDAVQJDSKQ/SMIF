import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Results() {
    const { tableData } = useContext(AppContext);

    if (tableData.length === 0) return null;

    // Process tableData to create HTML content and CSV content
    // This part depends on how you want to display the data
    // For now, I'll just display it as a simple table

    return (
        <div id="results">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        {Object.keys(tableData[0]).filter(key => key !== 'date').map(key => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.date}</td>
                            {Object.entries(row).filter(([key]) => key !== 'date').map(([key, value]) => (
                                <td key={key}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Add CSV download button here */}
        </div>
    );
}

export default Results;
