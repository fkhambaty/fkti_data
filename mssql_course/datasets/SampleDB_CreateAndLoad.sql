-- ============================================
-- SampleDB: Create and Load Sample Data
-- Use with FKTI SQL Server Course Modules 5-8
-- Run this script in SSMS after creating a new database (e.g. SampleDB)
-- ============================================

-- Use your database (change name if needed)
-- CREATE DATABASE SampleDB;
-- GO
-- USE SampleDB;
-- GO

-- Drop tables if they exist (for re-running the script)
IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID('dbo.Customers', 'U') IS NOT NULL DROP TABLE dbo.Customers;
IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;

-- Create Products table
CREATE TABLE dbo.Products (
    ProductID   INT PRIMARY KEY IDENTITY(1,1),
    ProductName VARCHAR(100) NOT NULL,
    Category    VARCHAR(50)  NOT NULL,
    UnitPrice   DECIMAL(10,2) NOT NULL
);

-- Create Customers table
CREATE TABLE dbo.Customers (
    CustomerID   INT PRIMARY KEY IDENTITY(1,1),
    CustomerName VARCHAR(100) NOT NULL,
    City         VARCHAR(50)  NOT NULL,
    Country      VARCHAR(50)  NOT NULL
);

-- Create Orders table
CREATE TABLE dbo.Orders (
    OrderID    INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    ProductID  INT NOT NULL,
    Quantity   INT NOT NULL,
    OrderDate  DATE NOT NULL,
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerID) REFERENCES dbo.Customers(CustomerID),
    CONSTRAINT FK_Orders_Products  FOREIGN KEY (ProductID)  REFERENCES dbo.Products(ProductID)
);

-- Insert sample products
INSERT INTO dbo.Products (ProductName, Category, UnitPrice) VALUES
('Laptop', 'Electronics', 899.99),
('Mouse', 'Electronics', 29.99),
('Keyboard', 'Electronics', 79.99),
('Monitor', 'Electronics', 249.99),
('Desk Chair', 'Furniture', 199.99),
('Desk', 'Furniture', 349.99),
('Notebook', 'Stationery', 4.99),
('Pen Pack', 'Stationery', 12.99);

-- Insert sample customers
INSERT INTO dbo.Customers (CustomerName, City, Country) VALUES
('Alice Smith', 'New York', 'USA'),
('Bob Jones', 'London', 'UK'),
('Carol White', 'Sydney', 'Australia'),
('David Brown', 'Toronto', 'Canada'),
('Eve Davis', 'Berlin', 'Germany');

-- Insert sample orders
INSERT INTO dbo.Orders (CustomerID, ProductID, Quantity, OrderDate) VALUES
(1, 1, 1, '2024-01-15'),
(1, 2, 2, '2024-01-15'),
(2, 3, 1, '2024-01-16'),
(2, 4, 2, '2024-01-16'),
(3, 5, 1, '2024-01-17'),
(3, 6, 1, '2024-01-17'),
(4, 7, 10, '2024-01-18'),
(4, 8, 5, '2024-01-18'),
(5, 1, 1, '2024-01-19'),
(1, 3, 1, '2024-01-20'),
(2, 5, 2, '2024-01-21');

-- Verify
SELECT 'Products' AS TableName, COUNT(*) AS RowCount FROM dbo.Products
UNION ALL
SELECT 'Customers', COUNT(*) FROM dbo.Customers
UNION ALL
SELECT 'Orders', COUNT(*) FROM dbo.Orders;
