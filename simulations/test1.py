import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os

cwd = os.getcwd()
print(cwd)


np.random.seed(42)
data_path = 'data/OMAB.csv'
data = pd.read_csv(data_path)
dates = data['Date'].values
prices = data['Adj Close'].values

print(prices)
print(dates)




# Calculate daily returns and 
returns = prices[1:] / prices[:-1] - 1
daily_volatility = returns.std()
annual_volatility = daily_volatility * np.sqrt(252)
print(returns)

# Monte Carlo simulation
n_simulations = 10000
YEARS = 2
n_days = 252 * years
simulated_end_prices = []

for _ in range(n_simulations):
    simulated_returns = np.random.choice(returns, n_days, replace=True)
    simulated_prices = np.cumprod(1 + simulated_returns) * prices[-1]  # Start from the last known price
    simulated_end_prices.append(simulated_prices[-1])

# Plotting
plt.figure(figsize=(12, 5))

# Input distribution (last known price)
plt.subplot(1, 2, 1)
plt.hist([prices[-1]]*n_simulations, bins=50, alpha=0.5, color='blue')
plt.title("Distribution of Starting Price")
plt.xlabel("Price")
plt.ylabel("Frequency")




# Output distribution (simulated end prices)
plt.subplot(1, 2, 2)
plt.hist(simulated_end_prices, bins=100, alpha=0.5, color='green', density=True)
plt.title("Distribution of Simulated End Prices after {} Year(s)".format(YEARS))
plt.xlabel("Price")
plt.ylabel("Relative Frequency (%)")
plt.xlim(0, 2000)
plt.ylim(0, 0.004)
plt.gca().yaxis.set_major_formatter(PercentFormatter(1))




plt.tight_layout()
plt.show()