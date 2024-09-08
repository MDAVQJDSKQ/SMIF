import React, { useState } from 'react';
import FinancialChart from './FinancialChart';
import DataTable from './DataTable';

function FinancialDashboard({ ticker, frequency, timeRange }) {
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const handleGetRatios = () => {
    setTableData(chartData);
  };

  return (
    <div className="financial-dashboard">
      <div className="chart-section">
        <FinancialChart data={chartData} />
      </div>
      <div className="table-section">
        <button onClick={handleGetRatios}>Get Ratios</button>
        <DataTable data={tableData} />
      </div>
    </div>
  );
}