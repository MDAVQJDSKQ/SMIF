import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os

cwd = os.getcwd()
print(cwd)


np.random.seed(123)
data_path = 'data/OMAB.csv'
data = pd.read_csv(data_path)
dates = data['Date'].values
prices = data['Adj Close'].values

# Calculate returns and volatility
returns = prices[1:] / prices[:-1] - 1
daily_volatility = returns.std()
mean_return = returns.mean()

# Monte Carlo simulation
n_simulations = 10000
YEARS = 2
n_days = 252 * YEARS
simulated_end_prices = []

for _ in range(n_simulations):
    simulated_returns = np.random.normal(mean_return, daily_volatility, n_days)
    simulated_prices = np.cumprod(1 + simulated_returns) * prices[-1]  # Start from the last known price
    simulated_end_prices.append(simulated_prices[-1])

# Plotting
plt.figure(figsize=(12, 5))

# Input distribution (last known price)
plt.subplot(1, 2, 1)
sample_returns = np.random.normal(mean_return, daily_volatility, 10000)
plt.hist(sample_returns, bins=100, alpha=0.75, color='blue')
plt.title("Input Distribution of Returns")
plt.xlabel("Return")
plt.ylabel("Frequency")




# Output distribution (simulated end prices)
plt.subplot(1, 2, 2)
plt.hist(simulated_end_prices, bins=50, alpha=0.75, color='green', range=(0, 600))
plt.title(f"Distribution of Simulated End Prices after {YEARS} Years")
plt.xlabel("Price")
plt.ylabel("Frequency")

# Summary statistics
mean_price = np.mean(simulated_end_prices)
median_price = np.median(simulated_end_prices)
std_price = np.std(simulated_end_prices)
min_price = np.min(simulated_end_prices)
max_price = np.max(simulated_end_prices)

summary_stats = pd.DataFrame({
    'Statistic': ['Mean', 'Median', 'Standard Deviation', 'Minimum', 'Maximum'],
    'Price after 2 years': [mean_price, median_price, std_price, min_price, max_price]
})

print(summary_stats)




plt.tight_layout()
plt.show()