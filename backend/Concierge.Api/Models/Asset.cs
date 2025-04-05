using System.ComponentModel.DataAnnotations;

namespace Concierge.Api.Models;

// Enum defining the default asset types mentioned in the rules
public enum AssetType
{
    TelephoneNumber,
    SIMCard,
    Equipment,
    License
    // Add other custom types as needed
}

public class Asset
{
    [Key] // Assuming you'll use Entity Framework Core, marks this as the primary key
    public int Id { get; set; } // Or Guid Id { get; set; }

    [Required]
    public AssetType Type { get; set; }

    [Required]
    [MaxLength(255)] // Example length constraint
    public string Name { get; set; } = default!;

    [MaxLength(100)]
    public string? SerialNumber { get; set; } // Nullable if not all assets have one

    // Foreign key to the Customer/Account entity (assuming you have one)
    // TODO: Add navigation property: public Customer Customer { get; set; }
    public int CustomerId { get; set; } // Or Guid, string etc. depending on Customer key type

    public bool IsManaged { get; set; } = false; // Differentiates managed vs. non-managed assets

    // Properties populated from Product Catalog (examples)
    [MaxLength(100)]
    public string? Manufacturer { get; set; }
    [MaxLength(100)]
    public string? Model { get; set; }

    // TODO: Add other relevant properties based on concierge-rules.mdc
    // e.g., Location, Purchase Details, Warranty, Custom Fields based on Type, etc.
    // public string? IpAddress { get; set; }
    // public string? MacAddress { get; set; }
    // public string? LicenseKey { get; set; }
    // public DateTime? PurchaseDate { get; set; }
    // public decimal? PurchasePrice { get; set; }
    // public DateTime? WarrantyExpiration { get; set; }

    // Timestamps for tracking
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public DateTime DateModified { get; set; } = DateTime.UtcNow;

    // TODO: Add relationships (e.g., Tickets, Recurring Services)
    // public virtual ICollection<Ticket>? Tickets { get; set; }
} 