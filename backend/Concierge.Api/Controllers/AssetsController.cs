using Microsoft.AspNetCore.Mvc;
using Concierge.Api.Dtos.Assets;
using Concierge.Api.Models;
using Concierge.Api.Services;

namespace Concierge.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // Defines the route prefix as /api/assets
public class AssetsController : ControllerBase
{
    private readonly IAssetService _assetService;

    // Inject the service via constructor
    public AssetsController(IAssetService assetService)
    {
        _assetService = assetService;
    }

    // GET: api/assets
    [HttpGet]
    public async Task<IActionResult> GetAssets()
    {
        var assets = await _assetService.GetAllAssetsAsync();
        // TODO: Map Assets to AssetDtos if you want to return DTOs instead of the full Model
        return Ok(assets);
    }

    // GET: api/assets/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAssetById(int id)
    {
        if (id <= 0) // Basic validation
        {
            return BadRequest("Invalid asset ID.");
        }

        var asset = await _assetService.GetAssetByIdAsync(id);

        if (asset == null)
        {
            return NotFound($"Asset with ID {id} not found.");
        }

        // TODO: Map Asset to AssetDto if needed
        return Ok(asset);
    }

    // POST: api/assets
    [HttpPost]
    public async Task<IActionResult> CreateAsset([FromBody] CreateAssetDto assetDto)
    {
        if (assetDto == null)
        {
            return BadRequest("Asset data is required.");
        }

        // Explicitly check model state, although [ApiController] handles this automatically
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var newAsset = await _assetService.CreateAssetAsync(assetDto);

        // Return 201 Created status with location header and the created asset
        return CreatedAtAction(nameof(GetAssetById), new { id = newAsset.Id }, newAsset);
    }

    // PUT: api/assets/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsset(int id, [FromBody] UpdateAssetDto assetDto)
    {
        if (id <= 0)
        {
            return BadRequest("Invalid asset ID.");
        }
        if (assetDto == null)
        {
            return BadRequest("Asset data is required.");
        }

        // Explicitly check model state, although [ApiController] handles this automatically
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updated = await _assetService.UpdateAssetAsync(id, assetDto);

        if (!updated)
        {
            // Assuming false means the asset wasn't found
            return NotFound($"Asset with ID {id} not found for update.");
        }

        return NoContent(); // Return 204 No Content on successful update
    }

    // DELETE: api/assets/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsset(int id)
    {
        if (id <= 0)
        {
            return BadRequest("Invalid asset ID.");
        }

        var deleted = await _assetService.DeleteAssetAsync(id);

        if (!deleted)
        {
            // Assuming false means the asset wasn't found
            return NotFound($"Asset with ID {id} not found for deletion.");
        }

        return NoContent(); // Return 204 No Content on successful deletion
    }
}