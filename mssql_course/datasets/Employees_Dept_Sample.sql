-- ============================================
-- Employees & Departments Sample Data
-- Use with FKTI SQL Server Course (Joins, GROUP BY)
-- ============================================

-- USE YourDatabaseName;
-- GO

IF OBJECT_ID('dbo.Employees', 'U') IS NOT NULL DROP TABLE dbo.Employees;
IF OBJECT_ID('dbo.Departments', 'U') IS NOT NULL DROP TABLE dbo.Departments;

CREATE TABLE dbo.Departments (
    DeptID   INT PRIMARY KEY IDENTITY(1,1),
    DeptName VARCHAR(50) NOT NULL,
    Location VARCHAR(50) NOT NULL
);

CREATE TABLE dbo.Employees (
    EmployeeID   INT PRIMARY KEY IDENTITY(1,1),
    FirstName    VARCHAR(50) NOT NULL,
    LastName     VARCHAR(50) NOT NULL,
    DeptID       INT NULL,
    HireDate     DATE NOT NULL,
    Salary       DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_Employees_Dept FOREIGN KEY (DeptID) REFERENCES dbo.Departments(DeptID)
);

INSERT INTO dbo.Departments (DeptName, Location) VALUES
('Sales', 'Building A'),
('IT', 'Building B'),
('HR', 'Building A'),
('Marketing', 'Building C');

INSERT INTO dbo.Employees (FirstName, LastName, DeptID, HireDate, Salary) VALUES
('John', 'Smith', 1, '2020-03-15', 55000.00),
('Jane', 'Doe', 1, '2021-06-01', 52000.00),
('Mike', 'Johnson', 2, '2019-01-10', 72000.00),
('Sarah', 'Williams', 2, '2022-02-20', 68000.00),
('Tom', 'Brown', 3, '2020-11-05', 48000.00),
('Lisa', 'Davis', NULL, '2023-04-12', 45000.00),
('Chris', 'Wilson', 4, '2021-08-30', 58000.00);

SELECT 'Departments' AS TableName, COUNT(*) AS Rows FROM dbo.Departments
UNION ALL SELECT 'Employees', COUNT(*) FROM dbo.Employees;
