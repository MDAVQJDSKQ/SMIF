import React from 'react';

function VisualizerDataCategories({ selectedRatios, handleCheckboxChange }) {
  const categories = [
    {
      title: "Income Statement",
      ratios: [
        { id: "revenue", label: "Revenue" },
        { id: "costOfRevenue", label: "Cost of Revenue" },
        { id: "grossProfit", label: "Gross Profit" },
        { id: "operatingIncome", label: "Operating Income" },
        { id: "netIncome", label: "Net Income" }
      ]
    },
    {
      title: "Balance Sheet",
      ratios: [
        { id: "totalAssets", label: "Total Assets" },
        { id: "totalLiabilities", label: "Total Liabilities" },
        { id: "totalEquity", label: "Total Equity" },
        { id: "cashAndCashEquivalents", label: "Cash and Cash Equivalents" },
        { id: "totalDebt", label: "Total Debt" }
      ]
    },
    {
      title: "Cash Flow Statement",
      ratios: [
        { id: "operatingCashFlow", label: "Operating Cash Flow" },
        { id: "capitalExpenditure", label: "Capital Expenditure" },
        { id: "freeCashFlow", label: "Free Cash Flow" },
        { id: "dividendsPaid", label: "Dividends Paid" },
        { id: "netCashUsedForInvestingActivites", label: "Net Cash Used For Investing Activities" }
      ]
    },
    {
      title: "Liquidity Ratios",
      ratios: [
        { id: "currentRatio", label: "Current Ratio" },
        { id: "quickRatio", label: "Quick Ratio" },
        { id: "cashRatio", label: "Cash Ratio" }
      ]
    },
    {
      title: "Profitability Ratios",
      ratios: [
        { id: "grossProfitMargin", label: "Gross Profit Margin" },
        { id: "operatingProfitMargin", label: "Operating Profit Margin" },
        { id: "netProfitMargin", label: "Net Profit Margin" },
        { id: "returnOnAssets", label: "Return on Assets (ROA)" },
        { id: "returnOnEquity", label: "Return on Equity (ROE)" }
      ]
    },
    {
      title: "Leverage Ratios",
      ratios: [
        { id: "debtRatio", label: "Debt Ratio" },
        { id: "debtToEquityRatio", label: "Debt to Equity Ratio" },
        { id: "interestCoverageRatio", label: "Interest Coverage Ratio" }
      ]
    },
    {
      title: "Efficiency Ratios",
      ratios: [
        { id: "assetTurnover", label: "Asset Turnover" },
        { id: "inventoryTurnover", label: "Inventory Turnover" },
        { id: "receivablesTurnover", label: "Receivables Turnover" }
      ]
    },
    {
      title: "Market Value Ratios",
      ratios: [
        { id: "earningsPerShare", label: "Earnings Per Share (EPS)" },
        { id: "priceToEarningsRatio", label: "Price to Earnings Ratio (P/E)" },
        { id: "priceToBookRatio", label: "Price to Book Ratio (P/B)" },
        { id: "dividendYield", label: "Dividend Yield" }
      ]
    }
  ];

  // Render checkboxes similar to the original DataCategories component
  return (
    <div className="data-categories">
      {categories.map(category => (
        <div key={category.title} className="ratio-category">
          <h2>{category.title}</h2>
          {category.ratios.map(ratio => (
            <div key={ratio.id} className="ratio-item">
              <input
                type="checkbox"
                id={ratio.id}
                name="ratios"
                value={ratio.id}
                checked={selectedRatios.includes(ratio.id)}
                onChange={handleCheckboxChange}
                disabled={selectedRatios.length >= 5 && !selectedRatios.includes(ratio.id)}
              />
              <label htmlFor={ratio.id}>{ratio.label}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default VisualizerDataCategories;
