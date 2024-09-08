export function calculate_condensed_income_statement(data) {
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

export function calculate_condensed_balance_sheet(data) {
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

export function calculate_condensed_cash_flow(data) {
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

export function processData(item, data) {
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