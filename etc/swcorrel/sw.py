import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import pearsonr

def analyze_correlation(csv_file, x):
    # Read the CSV file
    df = pd.read_csv(csv_file)
    date = df.iloc[:, 0]
    var1 = df.iloc[:, 1]
    var2 = df.iloc[:, 2]

    r_values = []
    # Loop through the data with a sliding window
    for i in range(len(var1) - x + 1):
        # Calculate the correlation coefficient for var1 and var2 over the sliding window
        r, _ = pearsonr(var1[i:i+x], var2[i:i+x])
        r_values.append(r)

    # Create a table of r values
    table = pd.DataFrame({'Window': range(1, len(r_values) + 1), 'R Value': r_values})
    
    # Plot the distribution of r values
    plt.figure(figsize=(10, 6))
    plt.hist(r_values, bins=20, edgecolor='black')
    plt.title(f'Distribution of Correlation Coefficients (Window Size: {x})')
    plt.xlabel('Correlation Coefficient (r)')
    plt.ylabel('Frequency')
    plt.show()

    return table, r_values

# Usage
csv_file = '/Users/spencerhodge/Documents/Github/SMIF/etc/swcorrel/PCE_DSPI.csv'
window_size = 10
tables, r_values = analyze_correlation(csv_file, window_size)