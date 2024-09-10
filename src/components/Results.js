import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Results() {
    const { tableData } = useContext(AppContext);

    if (tableData.length === 0) return null;

    const columns = Object.keys(tableData[0]).filter(key => key !== 'date');

    const formatValue = (value) => {
        if (typeof value === 'number') {
            return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
        } else if (value === undefined || value === null) {
            return 'N/A';
        } else {
            return value.toString();
        }
    };

    return (
        <div id="results">
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th className="sticky-col">Ratio / Date</th>
                            {tableData.map(row => (
                                <th key={row.date}>{row.date}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {columns.map(column => (
                            <tr key={column}>
                                <td className="sticky-col">{column}</td>
                                {tableData.map(row => (
                                    <td key={`${row.date}-${column}`}>
                                        {formatValue(row[column])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Results;
