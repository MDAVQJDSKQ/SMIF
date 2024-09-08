import React from 'react';

function DataCategories({ selectedRatios, handleCheckboxChange }) {
  const categories = [
    {
      title: "Income Statement",
      ratios: [
        { id: "incomeStatementCondensed", label: "Income Statement" },
        { id: "incomeStatement", label: "Income Statement (Expanded)" }
      ]
    },
    {
      title: "Balance Sheet",
      ratios: [
        { id: "balanceSheetCondensed", label: "Balance Sheet" },
        { id: "balanceSheet", label: "Balance Sheet (Expanded)" }
      ]
    },
    {
      title: "Cash Flow Statement",
      ratios: [
        { id: "cashFlowStatementCondensed", label: "Cash Flow Statement" },
        { id: "cashFlowStatement", label: "Cash Flow Statement (Expanded)" }
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
        { id: "returnOnEquity", label: "Return on Equity (ROE)" },
        { id: "returnOnCapitalEmployed", label: "Return on Capital Employed (ROCE)" }
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
        { id: "receivablesTurnover", label: "Receivables Turnover" },
        { id: "payablesTurnover", label: "Payables Turnover" }
      ]
    },
    {
      title: "Market Value Ratios",
      ratios: [
        { id: "earningsPerShare", label: "Earnings Per Share (EPS)" },
        { id: "priceToEarningsRatio", label: "Price to Earnings Ratio (P/E)" },
        { id: "priceToBookRatio", label: "Price to Book Ratio (P/B)" },
        { id: "dividendYield", label: "Dividend Yield" },
        { id: "payoutRatio", label: "Payout Ratio" }
      ]
    }
  ];

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
              />
              <label htmlFor={ratio.id}>{ratio.label}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default DataCategories;
