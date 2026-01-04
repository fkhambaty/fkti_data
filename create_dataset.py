# ============================================
# STUDENT PERFORMANCE DATASET CREATOR
# Run this file to create the dataset
# ============================================

import pandas as pd
import numpy as np
import random

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

# Create Student Performance Dataset
n_students = 100

# Generate data
data = {
    'student_id': range(1, n_students + 1),
    'math_score': np.random.normal(75, 15, n_students).round(1),  # Mean=75, Std=15
    'statistics_score': np.random.normal(72, 18, n_students).round(1),  # Mean=72, Std=18
    'study_hours': np.random.normal(25, 8, n_students).round(1),  # Mean=25, Std=8
    'attendance': np.random.normal(85, 10, n_students).round(1),  # Mean=85, Std=10
    'age': np.random.randint(18, 25, n_students),
    'gender': np.random.choice(['M', 'F'], n_students)
}

# Add some correlation between math and statistics scores
data['statistics_score'] = data['math_score'] * 0.85 + np.random.normal(0, 8, n_students)

# Add some missing values (5% missing)
missing_indices = np.random.choice(n_students, size=int(n_students * 0.05), replace=False)
for idx in missing_indices:
    data['study_hours'][idx] = np.nan

# Add some outliers (3 outliers)
outlier_indices = np.random.choice(n_students, size=3, replace=False)
for idx in outlier_indices:
    data['math_score'][idx] = np.random.choice([25, 120])  # Very low or very high

# Create DataFrame
df_students = pd.DataFrame(data)

# Ensure scores are between 0-100
df_students['math_score'] = df_students['math_score'].clip(0, 100)
df_students['statistics_score'] = df_students['statistics_score'].clip(0, 100)
df_students['attendance'] = df_students['attendance'].clip(0, 100)

# Save to CSV
df_students.to_csv('student_performance_dataset.csv', index=False)
print("✅ Dataset created: student_performance_dataset.csv")
print(f"📊 Dataset shape: {df_students.shape}")
print("\nFirst 5 rows:")
print(df_students.head())
print("\nDataset saved in the same folder as this Python file!")

