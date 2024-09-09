import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [chartData, setChartData] = useState({});
    const [tableData, setTableData] = useState([]);

    return (
        <AppContext.Provider value={{ chartData, setChartData, tableData, setTableData }}>
            {children}
        </AppContext.Provider>
    );
};