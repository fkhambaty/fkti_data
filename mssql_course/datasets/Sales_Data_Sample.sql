-- ============================================
-- Sales Data Sample (for Aggregations, Dates)
-- ============================================

-- USE YourDatabaseName;
-- GO

IF OBJECT_ID('dbo.Sales', 'U') IS NOT NULL DROP TABLE dbo.Sales;

CREATE TABLE dbo.Sales (
    SaleID    INT PRIMARY KEY IDENTITY(1,1),
    SaleDate DATE NOT NULL,
    Region   VARCHAR(50) NOT NULL,
    Amount   DECIMAL(10,2) NOT NULL
);

INSERT INTO dbo.Sales (SaleDate, Region, Amount) VALUES
('2024-01-01', 'North', 1200.00),
('2024-01-01', 'South', 980.50),
('2024-01-02', 'North', 1500.00),
('2024-01-02', 'South', 1100.00),
('2024-01-02', 'East', 750.25),
('2024-01-03', 'North', 890.00),
('2024-01-03', 'East', 1340.00),
('2024-01-04', 'South', 2100.00),
('2024-01-04', 'North', 950.00),
('2024-01-05', 'East', 1650.50);

SELECT 'Sales' AS TableName, COUNT(*) AS Rows FROM dbo.Sales;
