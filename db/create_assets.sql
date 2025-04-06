-- db/01_create_tables.sql

-- Customers Table Definition --
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Customers]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Customers](
    [CustomerID] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](255) NOT NULL,
    -- Add other relevant customer fields like AccountNumber, Address, ContactInfo etc.
    [CreatedDate] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
    [LastModifiedDate] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
 CONSTRAINT [PK_Customers] PRIMARY KEY CLUSTERED ([CustomerID] ASC)
) ON [PRIMARY]
PRINT 'Customers table created.'
END
ELSE
BEGIN
PRINT 'Customers table already exists.'
END
GO

-- Sites Table Definition --
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Sites]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Sites](
    [SiteID] [int] IDENTITY(1,1) NOT NULL,
    [CustomerID] [int] NOT NULL, -- Foreign key to Customers
    [Name] [nvarchar](255) NOT NULL, -- e.g., 'Main Office', 'Warehouse A'
    -- Add other relevant site fields like Address, ContactInfo etc.
    [CreatedDate] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
    [LastModifiedDate] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
 CONSTRAINT [PK_Sites] PRIMARY KEY CLUSTERED ([SiteID] ASC),
 CONSTRAINT [FK_Sites_Customers] FOREIGN KEY([CustomerID]) REFERENCES [dbo].[Customers] ([CustomerID])
) ON [PRIMARY]
PRINT 'Sites table created.'
END
ELSE
BEGIN
PRINT 'Sites table already exists.'
END
GO

-- AssetTypes Table Definition --
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AssetTypes]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[AssetTypes](
    [AssetTypeID] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [Description] [nvarchar](255) NULL,
 CONSTRAINT [PK_AssetTypes] PRIMARY KEY CLUSTERED 
(
    [AssetTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_AssetTypes_Name] UNIQUE NONCLUSTERED 
(
    [Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
PRINT 'AssetTypes table created.'
END
ELSE
BEGIN
PRINT 'AssetTypes table already exists.'
END
GO

-- Insert Default Asset Types --
-- Ensure the inserts only happen if the types don't already exist by name
IF NOT EXISTS (SELECT 1 FROM [dbo].[AssetTypes] WHERE [Name] = N'Telephone Number')
BEGIN
    INSERT INTO [dbo].[AssetTypes] ([Name], [Description]) VALUES (N'Telephone Number', N'Standard telephone number asset');
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[AssetTypes] WHERE [Name] = N'SIM Card')
BEGIN
    INSERT INTO [dbo].[AssetTypes] ([Name], [Description]) VALUES (N'SIM Card', N'Subscriber Identity Module card');
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[AssetTypes] WHERE [Name] = N'Equipment')
BEGIN
    INSERT INTO [dbo].[AssetTypes] ([Name], [Description]) VALUES (N'Equipment', N'Physical hardware or equipment');
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[AssetTypes] WHERE [Name] = N'License')
BEGIN
    INSERT INTO [dbo].[AssetTypes] ([Name], [Description]) VALUES (N'License', N'Software or service license');
END
GO

PRINT 'Default Asset Types checked/inserted.'
GO

-- Assets Table Definition --
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Assets]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Assets](
    [AssetID] [int] IDENTITY(1,1) NOT NULL,
    [CustomerID] [int] NOT NULL, -- Foreign key to Customers
    [AssetTypeID] [int] NOT NULL, -- Foreign key to AssetTypes
    [ProductID] [int] NULL, -- Optional link to a Product Catalog table
    [Name] [nvarchar](255) NOT NULL,
    [Description] [nvarchar](max) NULL,
    [SerialNumber] [nvarchar](100) NULL,
    [Manufacturer] [nvarchar](100) NULL,
    [Model] [nvarchar](100) NULL,
    [Status] [nvarchar](50) NOT NULL DEFAULT N'Active', -- e.g., Active, Inactive, Disposed
    [IsManaged] [bit] NOT NULL DEFAULT 0,
    [ManagedAssetID] [nvarchar](255) NULL, -- Unique ID from external system (RMM, etc.)
    [SiteID] [int] NULL, -- Foreign key to Sites
    [LocationDetail] [nvarchar](255) NULL, -- e.g., Room, Floor, Rack
    [PurchaseDate] [date] NULL,
    [PurchasePrice] [decimal](18, 2) NULL,
    [WarrantyExpiryDate] [date] NULL,
    [CreatedDate] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
    [LastModifiedDate] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
 CONSTRAINT [PK_Assets] PRIMARY KEY CLUSTERED ([AssetID] ASC),
 CONSTRAINT [FK_Assets_Customers] FOREIGN KEY([CustomerID]) REFERENCES [dbo].[Customers] ([CustomerID]),
 CONSTRAINT [FK_Assets_AssetTypes] FOREIGN KEY([AssetTypeID]) REFERENCES [dbo].[AssetTypes] ([AssetTypeID]),
 CONSTRAINT [FK_Assets_Sites] FOREIGN KEY([SiteID]) REFERENCES [dbo].[Sites] ([SiteID]) -- Note: SiteID allows NULLs
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
PRINT 'Assets table created.'
END
ELSE
BEGIN
PRINT 'Assets table already exists.'
END
GO

-- Optional: Add indexes for frequently queried columns like CustomerID, SerialNumber, Status
-- CREATE INDEX IX_Assets_CustomerID ON dbo.Assets (CustomerID);
-- CREATE INDEX IX_Assets_SerialNumber ON dbo.Assets (SerialNumber) WHERE SerialNumber IS NOT NULL;
-- CREATE INDEX IX_Assets_Status ON dbo.Assets (Status);
-- GO

-- Optional: Add a trigger to update LastModifiedDate on updates
-- CREATE TRIGGER TR_Assets_UpdateLastModifiedDate
-- ON dbo.Assets
-- AFTER UPDATE
-- AS
-- BEGIN
--     SET NOCOUNT ON;
--     UPDATE dbo.Assets
--     SET LastModifiedDate = GETUTCDATE()
--     FROM inserted
--     WHERE dbo.Assets.AssetID = inserted.AssetID;
-- END
-- GO 