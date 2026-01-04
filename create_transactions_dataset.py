# ============================================
# TRANSACTION DATASET CREATOR FOR MARKET BASKET ANALYSIS
# Run this file to create the transaction dataset
# ============================================

import pandas as pd
import numpy as np
import random

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

# Create sample transactions
transactions = [
    ['Bread', 'Butter', 'Milk'],
    ['Bread', 'Butter'],
    ['Bread', 'Milk'],
    ['Butter', 'Milk', 'Eggs'],
    ['Bread', 'Butter', 'Milk', 'Eggs'],
    ['Bread', 'Jam'],
    ['Butter', 'Milk'],
    ['Bread', 'Butter', 'Jam'],
    ['Milk', 'Eggs'],
    ['Bread', 'Milk', 'Eggs']
]

# Convert to DataFrame
df_transactions = pd.DataFrame({
    'transaction_id': range(1, len(transactions) + 1),
    'items': [', '.join(t) for t in transactions]
})

# Save
df_transactions.to_csv('transactions_dataset.csv', index=False)
print("✅ Transaction dataset created: transactions_dataset.csv")

# Also create binary matrix format
items = ['Bread', 'Butter', 'Milk', 'Eggs', 'Jam']
transaction_matrix = []

for trans in transactions:
    row = [1 if item in trans else 0 for item in items]
    transaction_matrix.append(row)

df_matrix = pd.DataFrame(transaction_matrix, columns=items)
df_matrix['transaction_id'] = range(1, len(transactions) + 1)
df_matrix = df_matrix[['transaction_id'] + items]
df_matrix.to_csv('transactions_matrix.csv', index=False)
print("✅ Transaction matrix created: transactions_matrix.csv")
print("\nBoth files saved in the same folder as this Python file!")

