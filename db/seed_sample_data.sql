-- db/seed_sample_data.sql
-- This script populates the database with sample data for development/testing.

-- Ensure script is run in the correct database context if needed
-- USE YourDatabaseName;
-- GO

BEGIN TRANSACTION;

BEGIN TRY

    -- Sample Customers --
    DECLARE @Cust1ID INT, @Cust2ID INT;

    IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Name = 'Sample Corp')
    BEGIN
        INSERT INTO dbo.Customers (Name) VALUES ('Sample Corp');
        SET @Cust1ID = SCOPE_IDENTITY();
        PRINT 'Inserted Customer: Sample Corp (ID: ' + CAST(@Cust1ID AS VARCHAR) + ')';
    END
    ELSE
    BEGIN
        SELECT @Cust1ID = CustomerID FROM dbo.Customers WHERE Name = 'Sample Corp';
        PRINT 'Customer already exists: Sample Corp (ID: ' + CAST(@Cust1ID AS VARCHAR) + ')';
    END

    IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Name = 'Test Inc')
    BEGIN
        INSERT INTO dbo.Customers (Name) VALUES ('Test Inc');
        SET @Cust2ID = SCOPE_IDENTITY();
        PRINT 'Inserted Customer: Test Inc (ID: ' + CAST(@Cust2ID AS VARCHAR) + ')';
    END
    ELSE
    BEGIN
        SELECT @Cust2ID = CustomerID FROM dbo.Customers WHERE Name = 'Test Inc';
        PRINT 'Customer already exists: Test Inc (ID: ' + CAST(@Cust2ID AS VARCHAR) + ')';
    END

    -- Sample Sites --
    DECLARE @Site1ACust1 INT, @Site1BCust1 INT, @Site2ACust2 INT;

    IF NOT EXISTS (SELECT 1 FROM dbo.Sites WHERE CustomerID = @Cust1ID AND Name = 'Main Office')
    BEGIN
        INSERT INTO dbo.Sites (CustomerID, Name) VALUES (@Cust1ID, 'Main Office');
        SET @Site1ACust1 = SCOPE_IDENTITY();
        PRINT 'Inserted Site: Main Office for Sample Corp (ID: ' + CAST(@Site1ACust1 AS VARCHAR) + ')';
    END
    ELSE
    BEGIN
        SELECT @Site1ACust1 = SiteID FROM dbo.Sites WHERE CustomerID = @Cust1ID AND Name = 'Main Office';
    END
    
    IF NOT EXISTS (SELECT 1 FROM dbo.Sites WHERE CustomerID = @Cust1ID AND Name = 'Warehouse')
    BEGIN
        INSERT INTO dbo.Sites (CustomerID, Name) VALUES (@Cust1ID, 'Warehouse');
        SET @Site1BCust1 = SCOPE_IDENTITY();
        PRINT 'Inserted Site: Warehouse for Sample Corp (ID: ' + CAST(@Site1BCust1 AS VARCHAR) + ')';
    END
     ELSE
    BEGIN
        SELECT @Site1BCust1 = SiteID FROM dbo.Sites WHERE CustomerID = @Cust1ID AND Name = 'Warehouse';
    END
   
    IF NOT EXISTS (SELECT 1 FROM dbo.Sites WHERE CustomerID = @Cust2ID AND Name = 'Headquarters')
    BEGIN
        INSERT INTO dbo.Sites (CustomerID, Name) VALUES (@Cust2ID, 'Headquarters');
        SET @Site2ACust2 = SCOPE_IDENTITY();
        PRINT 'Inserted Site: Headquarters for Test Inc (ID: ' + CAST(@Site2ACust2 AS VARCHAR) + ')';
    END
    ELSE
    BEGIN
        SELECT @Site2ACust2 = SiteID FROM dbo.Sites WHERE CustomerID = @Cust2ID AND Name = 'Headquarters';
    END

    -- Get Asset Type IDs --
    DECLARE @AssetTypeEquipment INT, @AssetTypeLicense INT, @AssetTypePhone INT;
    SELECT @AssetTypeEquipment = AssetTypeID FROM dbo.AssetTypes WHERE Name = 'Equipment';
    SELECT @AssetTypeLicense = AssetTypeID FROM dbo.AssetTypes WHERE Name = 'License';
    SELECT @AssetTypePhone = AssetTypeID FROM dbo.AssetTypes WHERE Name = 'Telephone Number';

    -- Sample Assets --
    
    -- Asset 1: Laptop for Sample Corp at Main Office
    IF NOT EXISTS (SELECT 1 FROM dbo.Assets WHERE SerialNumber = 'LAP12345' AND CustomerID = @Cust1ID)
    BEGIN
        INSERT INTO dbo.Assets 
            (CustomerID, AssetTypeID, Name, Description, SerialNumber, Manufacturer, Model, Status, IsManaged, SiteID, LocationDetail, PurchaseDate, PurchasePrice, WarrantyExpiryDate)
        VALUES 
            (@Cust1ID, @AssetTypeEquipment, 'Dev Laptop 1', 'Primary laptop for developer', 'LAP12345', 'Dell', 'XPS 15', 'Active', 0, @Site1ACust1, 'Desk 101', '2023-01-15', 1800.00, '2026-01-14');
        PRINT 'Inserted Asset: Dev Laptop 1 (SN: LAP12345)';
    END
    
    -- Asset 2: Server for Sample Corp at Warehouse (No Site specific location)
    IF NOT EXISTS (SELECT 1 FROM dbo.Assets WHERE SerialNumber = 'SRV98765' AND CustomerID = @Cust1ID)
    BEGIN
        INSERT INTO dbo.Assets 
            (CustomerID, AssetTypeID, Name, SerialNumber, Manufacturer, Model, Status, IsManaged, SiteID, PurchaseDate, PurchasePrice)
        VALUES 
            (@Cust1ID, @AssetTypeEquipment, 'File Server', 'SRV98765', 'HPE', 'ProLiant DL380', 'Active', 0, @Site1BCust1, '2022-11-01', 4500.50);
        PRINT 'Inserted Asset: File Server (SN: SRV98765)';
    END
    
    -- Asset 3: Software License for Test Inc (Not site specific)
    IF NOT EXISTS (SELECT 1 FROM dbo.Assets WHERE Name = 'Microsoft 365 E3 License' AND CustomerID = @Cust2ID)
    BEGIN
        INSERT INTO dbo.Assets 
            (CustomerID, AssetTypeID, Name, Description, Status, IsManaged, PurchaseDate, PurchasePrice, WarrantyExpiryDate)
        VALUES 
            (@Cust2ID, @AssetTypeLicense, 'Microsoft 365 E3 License', 'Annual subscription license', 'Active', 1, '2024-03-01', 360.00, '2025-02-28'); -- Assuming WarrantyExpiryDate is used for license expiry
        PRINT 'Inserted Asset: Microsoft 365 E3 License';
    END
    
    -- Asset 4: Phone Number for Test Inc at Headquarters
    IF NOT EXISTS (SELECT 1 FROM dbo.Assets WHERE Name = '555-123-4567' AND CustomerID = @Cust2ID)
    BEGIN
        INSERT INTO dbo.Assets 
            (CustomerID, AssetTypeID, Name, Description, Status, IsManaged, SiteID, LocationDetail)
        VALUES 
            (@Cust2ID, @AssetTypePhone, '555-123-4567', 'Main line number', 'Active', 0, @Site2ACust2, 'Reception Desk');
        PRINT 'Inserted Asset: Phone Number 555-123-4567';
    END

    PRINT 'Sample data seeding completed successfully.';
    COMMIT TRANSACTION;

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    PRINT 'Error occurred during sample data seeding:';
    PRINT ERROR_MESSAGE();
    -- Optionally re-throw the error
    -- THROW;
END CATCH
GO 