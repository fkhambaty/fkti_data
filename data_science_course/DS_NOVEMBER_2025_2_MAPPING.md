# Data Science Course – DS November 2025 2 Mapping

This document maps every folder and dataset in **Downloads → DS November 2025 2** to the Data Science course so that all materials are used and easy to find.

---

## Session materials → Course modules

| DS November 2025 2 folder / content | Course usage |
|-------------------------------------|--------------|
| **Session_0_Data Science Introduction** | Intro: use **Main site → Data Science Intro** ([data-science.html](../data-science.html)). PDF aligns with course overview. |
| **Session_1_Introduction to python** | ✅ **Module 1: Python Basics** → [python-basics.html](python-basics.html) (Variables, intro). |
| **Session_2_Data Types in python** | ✅ **Module 1** → [python-basics.html](python-basics.html), [python-data-structures.html](python-data-structures.html). |
| **Session_3_Loops and Conditions** | ✅ **Module 1** → python-basics.html (Loops, If Statements). |
| **Session_4_Dat Structures-Part-I** | ✅ **Module 1** → [python-data-structures.html](python-data-structures.html) (Lists, Tuples). |
| **Session_5_Data Structures _Part-II** | ✅ **Module 1** → python-data-structures.html (Sets, Dictionaries). |
| **Session_6_Functions_Part-I** | 🔜 **Module 1** → Functions (Coming Soon). Session notebooks = reference. |
| **Session_7_Functions_Part-II** | 🔜 **Module 1** → Functions (Coming Soon). |
| **Session_8_OOps in python** | 🔜 **Python & Data Wrangling** → OOP (Coming Soon). |
| **Session_9_Numpy** | 🔜 **Python & Data Wrangling** → NumPy (Coming Soon). List/Lambda notebooks align. |
| **Session_10_pandas_part-I** | 🔜 **Python & Data Wrangling** → Pandas Part I (Coming Soon). |
| **Session_11_pandas_part-II** | 🔜 **Python & Data Wrangling** → Pandas Part II (Coming Soon). Pandas_Cheat_Sheet.pdf = reference. |
| **Session_12_read_data_from_api_and _sql** | 🔜 **Python & Data Wrangling** → Read from API & SQL (Coming Soon). |
| **Session_13_Data Viz_I** | 🔜 **Python & Data Wrangling** → Data Viz – Matplotlib (Coming Soon). |
| **Session_14_Seaborn Data viz** | 🔜 **Python & Data Wrangling** → Seaborn (Coming Soon). |
| **Session_15_Web scraping using python** | 🔜 **Python & Data Wrangling** → Web Scraping (Coming Soon). |
| **Practice Questions** (Maths) | ✅ **Module 2: Math** → [math-foundations.html](math-foundations.html). Use [datasets.html](datasets.html) for data. |
| **Additional_Python_Questions** | ✅ **Practice & Assignments** – Python & Pandas practice; datasets: Housing, Hotel Reservations, auto-mpg, dataset.csv. |
| **Assignment 1** | ✅ **Module 1** practice. |
| **Assignment 2** | ✅ **Module 1** (data types / structures). |
| **Assignment 3** | ✅ **Module 1** practice. |
| **Assignment 4** | ✅ **Module 1–2** practice. |
| **Assignment 5** | ✅ **Statistics / Regression** – Housing.csv. |
| **Assignment 6** | ✅ **Statistics / ML** – Hotel Reservations. |
| **Assignment 7** | ✅ **ML / Regression** – insurance.csv. |
| **Maths - Varun** | ✅ **Module 2** → [math-foundations.html](math-foundations.html). PDF = slides. |
| **Statistics - Varun** | ✅ **Module 3** → [statistics-foundations.html](statistics-foundations.html), [missing-values-outliers.html](missing-values-outliers.html). Data: titanic3.xlsx, Housing.csv, Practice.xlsx. |
| **Hypothesis Testing - Varun** | ✅ **Module 3** → [hypothesis-testing.html](hypothesis-testing.html). Hotel Reservations. |
| **Linear Regression - Varun** | ✅ **Module 4** → [linear-regression.html](linear-regression.html). Housing.csv. |
| **Logistic Regression - Varun** | ✅ **Module 4** → [logistic-regression.html](logistic-regression.html). dataset.csv; Classification Metrics doc = practice. |
| **Regularization - Varun** | ✅ **Module 4** → [bias-variance.html](bias-variance.html). auto-mpg.csv. |
| **KNN - Varun** | ✅ **Module 4** → [k-nearest-neighbors.html](k-nearest-neighbors.html). Iris.csv, insurance. |
| **SVM - Varun** | ✅ **Module 4** → [support-vector-machines.html](support-vector-machines.html), [svm-code-walkthrough.html](svm-code-walkthrough.html). BankChurnersData.csv. |
| **Clustering - Varun** | ✅ **Module 6** → [clustering.html](clustering.html), [kmeans-code-walkthrough.html](kmeans-code-walkthrough.html). Hotel Reservations. |
| **Dimensionality Reduction - PCA - Varun** | ✅ **Module 6** → [pca-dimensionality-reduction.html](pca-dimensionality-reduction.html). Uses **wine_data.csv**, **Dimension Reduction.pdf**, and **pca.ipynb** from Downloads → Dimensionality Reduction - PCA. |
| **A-B Testing and Market Basket Analysis - Varun** | ✅ **Module 9** → [ab-testing.html](ab-testing.html), [market-basket-analysis.html](market-basket-analysis.html). AB_testing_data.csv, market_baskets_data.csv, Apriori_Algorithm.xlsx. |

---

## Datasets used

All datasets from DS November 2025 2 are available on the course ** [Download Course Datasets](datasets.html) ** page:

- Housing.csv, Hotel Reservations.csv, auto_mpg.csv, insurance.csv  
- dataset.csv, heart_disease_dataset.csv, BankChurnersData.csv, Iris.csv  
- titanic3.xlsx, Practice.xlsx  
- AB_testing_data.csv, market_baskets_data.csv, Apriori_Algorithm.xlsx  

Use the same folder as your notebook/script and load with `pd.read_csv("filename.csv")` or `pd.read_excel("filename.xlsx")`.

---

## How to add a new topic to the course

1. **Add a lesson page** in `data_science_course/` (e.g. `new-topic.html`), reusing the structure and styling of an existing lesson (e.g. [linear-regression.html](linear-regression.html) or [hypothesis-testing.html](hypothesis-testing.html)).
2. **Add the link in [index.html](index.html)** inside the right module card:
   - Use a `<span class="lesson-wrap">` and `<a href="new-topic.html" class="lesson-link" data-subtopics="Topic1|Topic2|...">` for subtopic popovers.
   - Match existing pattern: `<i class="fas fa-play-circle"></i> Lesson Title`.
3. **If the lesson uses a dataset**, add it under [datasets](datasets/) and add a card on [datasets.html](datasets.html) with description and download link.
4. **Update this mapping** (DS_NOVEMBER_2025_2_MAPPING.md) so the new topic is listed under the correct session or module.

---

*Last updated: March 2026. DS November 2025 2 = folder in Downloads used for this curriculum.*
