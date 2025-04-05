using Concierge.Api.Models;
using Concierge.Api.Dtos.Assets;

namespace Concierge.Api.Services;

public interface IAssetService
{
    // Note: Using Task<> for asynchronous operations, which is standard in I/O bound services
    Task<IEnumerable<Asset>> GetAllAssetsAsync(); // Consider adding filtering/pagination later
    Task<Asset?> GetAssetByIdAsync(int id);
    Task<Asset> CreateAssetAsync(CreateAssetDto assetDto);
    Task<bool> UpdateAssetAsync(int id, UpdateAssetDto assetDto); // Return bool indicating success/found
    Task<bool> DeleteAssetAsync(int id); // Return bool indicating success/found
}