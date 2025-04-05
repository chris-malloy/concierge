using System.ComponentModel.DataAnnotations;
using Concierge.Api.Models; // Assuming AssetType enum is here

namespace Concierge.Api.Dtos.Assets;

public class CreateAssetDto
{
    [Required]
    public AssetType Type { get; set; }

    [Required]
    [MaxLength(255)]
    public required string Name { get; set; }

    [Required]
    public int CustomerId { get; set; } // Or Guid, string etc.

    [MaxLength(100)]
    public string? SerialNumber { get; set; }

    public bool IsManaged { get; set; } = false;

    [MaxLength(100)]
    public string? Manufacturer { get; set; }

    [MaxLength(100)]
    public string? Model { get; set; }

    // Add other properties needed for creation, with validation
    // e.g., PurchaseDate, LicenseKey etc. based on Type
} 