using System.ComponentModel.DataAnnotations;
using Concierge.Api.Models; // Assuming AssetType enum is here

namespace Concierge.Api.Dtos.Assets;

public class UpdateAssetDto
{
    // Note: Typically, you might not allow changing the AssetType or CustomerId after creation,
    // or you might have different DTOs for different update scenarios.
    // For simplicity, this DTO allows updating most fields.

    [Required]
    public AssetType Type { get; set; }

    [Required]
    [MaxLength(255)]
    public required string Name { get; set; }

    // Consider if CustomerId should be updatable
    [Required]
    public int CustomerId { get; set; } // Or Guid, string etc.

    [MaxLength(100)]
    public string? SerialNumber { get; set; }

    public bool IsManaged { get; set; } = false;

    [MaxLength(100)]
    public string? Manufacturer { get; set; }

    [MaxLength(100)]
    public string? Model { get; set; }

    // Add other properties that can be updated, with validation
}