import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

def simulate_stock_prices(data_path, n_simulations=1000, years=2):
    # Read data from CSV file
    data = pd.read_csv(data_path)
    dates = data['Date'].values
    prices = data['Adj Close'].values

    # Calculate returns and volatility
    P_VALUE = 0.01
    returns = prices[1:] / prices[:-1] - 1 
    daily_volatility = returns.std()
    mean_return = returns.mean()

    # Monte Carlo simulation
    n_days = 252 * years
    simulated_end_prices = []

    for _ in range(n_simulations):
        simulated_returns = np.random.normal(mean_return, daily_volatility, n_days)
        simulated_prices = np.cumprod(1 + simulated_returns) * prices[-1]  # Start from the last known price
        simulated_end_prices.append(simulated_prices[-1])

    # Plotting
    plt.figure(figsize=(12, 5))

    # Input distribution (last known price)
    plt.subplot(1, 3, 1)
    sample_returns = np.random.normal(mean_return, daily_volatility, 10000)
    plt.hist(sample_returns, bins=100, alpha=0.75, color='blue')
    plt.title(f"Input Distribution of Historical\nDaily Returns ({n_simulations} samples)")
    plt.xlabel("Return")
    plt.ylabel("Frequency")

    # Output distribution (simulated end prices)
    plt.subplot(1, 3, 2)
    plt.hist(simulated_end_prices, bins=50, alpha=0.75, color='green', range=(0, np.percentile(simulated_end_prices, 99)))
    plt.title(f"Distribution of Simulated\nEnd Prices after {years} Years")
    plt.xlabel("Price")
    plt.ylabel("Frequency")


    # Summary statistics
    plt.subplot(1, 3, 3)
    mean_price = np.mean(simulated_end_prices)
    std_price = np.std(simulated_end_prices)
    min_price = np.min(simulated_end_prices)
    q1_price = np.percentile(simulated_end_prices, 25)
    median_price = np.median(simulated_end_prices)
    q3_price = np.percentile(simulated_end_prices, 75)
    max_price = np.max(simulated_end_prices)

    summary_stats = pd.DataFrame({
        'Statistic': ['Mean', 'Standard Deviation', 'Minimum', '1st Quartile', 'Median', '3rd Quartile', 'Maximum'],
        'Price after 2 years': [mean_price, std_price, min_price, q1_price, median_price, q3_price, max_price]
    })

    stats_text = summary_stats.to_string(index=False)
    plt.text(0.5, 0.5, stats_text, ha='center', va='center', fontsize=10, bbox={'facecolor': 'white', 'alpha': 0.5, 'pad': 5}, multialignment='center')
    plt.axis('off')

    plt.subplots_adjust(wspace=.3)
    plt.tight_layout()
    plt.show()

    return summary_stats

simulate_stock_prices('data/alk.csv', n_simulations=10000, years=2)
simulate_stock_prices('data/omab.csv', n_simulations=10000, years=2)