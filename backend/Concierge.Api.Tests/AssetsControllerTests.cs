using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Concierge.Api.Controllers;
using Concierge.Api.Services;
using Concierge.Api.Models;
using Concierge.Api.Dtos.Assets;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Concierge.Api.Tests;

public class AssetsControllerTests
{
    private readonly Mock<IAssetService> _mockAssetService;
    private readonly AssetsController _controller;

    public AssetsControllerTests()
    {
        // Arrange: Create mock instance of the service
        _mockAssetService = new Mock<IAssetService>();

        // Arrange: Create instance of the controller, injecting the mock service
        _controller = new AssetsController(_mockAssetService.Object);
    }

    // --- GetAssetById Tests --- 

    [Fact]
    public async Task GetAssetById_WithInvalidId_ReturnsBadRequest()
    {
        // Arrange
        int invalidId = 0;

        // Act
        var result = await _controller.GetAssetById(invalidId);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task GetAssetById_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        int nonExistentId = 999;
        _mockAssetService.Setup(service => service.GetAssetByIdAsync(nonExistentId))
                         .ReturnsAsync((Asset?)null); // Setup mock to return null

        // Act
        var result = await _controller.GetAssetById(nonExistentId);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetAssetById_WithExistingId_ReturnsOkObjectResultWithAsset()
    {
        // Arrange
        int existingId = 1;
        var expectedAsset = new Asset { Id = existingId, Name = "Test Asset", Type = AssetType.Equipment, CustomerId = 123 };
        _mockAssetService.Setup(service => service.GetAssetByIdAsync(existingId))
                         .ReturnsAsync(expectedAsset); // Setup mock to return the asset

        // Act
        var result = await _controller.GetAssetById(existingId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedAsset = Assert.IsType<Asset>(okResult.Value);
        Assert.Equal(existingId, returnedAsset.Id);
        Assert.Equal(expectedAsset.Name, returnedAsset.Name);
    }

    // --- GetAssets Tests --- 

    [Fact]
    public async Task GetAssets_WhenServiceReturnsEmptyList_ReturnsOkObjectResultWithEmptyList()
    {
        // Arrange
        var emptyList = new List<Asset>();
        _mockAssetService.Setup(service => service.GetAllAssetsAsync())
                         .ReturnsAsync(emptyList);

        // Act
        var result = await _controller.GetAssets();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedList = Assert.IsAssignableFrom<IEnumerable<Asset>>(okResult.Value);
        Assert.Empty(returnedList);
    }

    [Fact]
    public async Task GetAssets_WhenServiceReturnsAssets_ReturnsOkObjectResultWithAssets()
    {
        // Arrange
        var assetsList = new List<Asset>
        {
            new Asset { Id = 1, Name = "Asset 1", Type = AssetType.Equipment, CustomerId = 101 },
            new Asset { Id = 2, Name = "Asset 2", Type = AssetType.License, CustomerId = 102 }
        };
        _mockAssetService.Setup(service => service.GetAllAssetsAsync())
                         .ReturnsAsync(assetsList);

        // Act
        var result = await _controller.GetAssets();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedList = Assert.IsAssignableFrom<IEnumerable<Asset>>(okResult.Value);
        Assert.Equal(2, returnedList.Count()); // Check if the count matches
        Assert.Equal(assetsList, returnedList); // Check if the list content matches
    }

    // --- CreateAsset Tests --- 

    [Fact]
    public async Task CreateAsset_WithValidDto_ReturnsCreatedAtActionResultWithAsset()
    {
        // Arrange
        var assetDto = new CreateAssetDto
        {
            Name = "New Test Asset",
            Type = AssetType.Equipment,
            CustomerId = 101,
            SerialNumber = "SN12345"
        };

        var createdAsset = new Asset
        {
            Id = 5, // Simulate the ID generated upon creation
            Name = assetDto.Name,
            Type = assetDto.Type,
            CustomerId = assetDto.CustomerId,
            SerialNumber = assetDto.SerialNumber,
            DateCreated = System.DateTime.UtcNow // Approximate, exact value doesn't matter here
        };

        _mockAssetService.Setup(service => service.CreateAssetAsync(assetDto))
                         .ReturnsAsync(createdAsset);

        // Act
        var result = await _controller.CreateAsset(assetDto);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(AssetsController.GetAssetById), createdAtActionResult.ActionName);
        Assert.NotNull(createdAtActionResult.RouteValues);
        Assert.Equal(createdAsset.Id, createdAtActionResult.RouteValues["id"]);
        Assert.Equal(createdAsset, createdAtActionResult.Value);
    }

    [Fact]
    public async Task CreateAsset_WithNullDto_ReturnsBadRequest()
    {
        // Arrange
        CreateAssetDto? assetDto = null;

        // Act
        // Pass the explicitly null variable to the controller method
        var result = await _controller.CreateAsset(assetDto!);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        // Verify the service method was never called since validation fails first
        _mockAssetService.Verify(service => service.CreateAssetAsync(It.IsAny<CreateAssetDto>()), Times.Never);
    }

    [Fact]
    public async Task CreateAsset_WithInvalidModelState_ReturnsBadRequest()
    {
        // Arrange
        var assetDto = new CreateAssetDto { Name = "", Type = AssetType.Equipment, CustomerId = 1 }; // Example invalid DTO (empty Name if [Required])
        _controller.ModelState.AddModelError("Name", "The Name field is required."); // Manually add model error

        // Act
        var result = await _controller.CreateAsset(assetDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value); // Check if the value contains model state errors
        _mockAssetService.Verify(service => service.CreateAssetAsync(It.IsAny<CreateAssetDto>()), Times.Never);
    }

    // --- UpdateAsset Tests --- 

    [Fact]
    public async Task UpdateAsset_WithInvalidId_ReturnsBadRequest()
    {
        // Arrange
        int invalidId = 0;
        var assetDto = new UpdateAssetDto { Name = "Update", Type = AssetType.Equipment, CustomerId = 1 };

        // Act
        var result = await _controller.UpdateAsset(invalidId, assetDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        _mockAssetService.Verify(service => service.UpdateAssetAsync(It.IsAny<int>(), It.IsAny<UpdateAssetDto>()), Times.Never);
    }

    [Fact]
    public async Task UpdateAsset_WithNullDto_ReturnsBadRequest()
    {
        // Arrange
        int validId = 1;
        UpdateAssetDto? assetDto = null;

        // Act
        var result = await _controller.UpdateAsset(validId, assetDto!);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        _mockAssetService.Verify(service => service.UpdateAssetAsync(It.IsAny<int>(), It.IsAny<UpdateAssetDto>()), Times.Never);
    }

    [Fact]
    public async Task UpdateAsset_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        int nonExistentId = 999;
        var assetDto = new UpdateAssetDto { Name = "Update", Type = AssetType.Equipment, CustomerId = 1 };
        _mockAssetService.Setup(service => service.UpdateAssetAsync(nonExistentId, assetDto))
                         .ReturnsAsync(false); // Simulate service returning false (not found)

        // Act
        var result = await _controller.UpdateAsset(nonExistentId, assetDto);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UpdateAsset_WithValidIdAndDto_ReturnsNoContent()
    {
        // Arrange
        int existingId = 1;
        var assetDto = new UpdateAssetDto { Name = "Updated Asset", Type = AssetType.Equipment, CustomerId = 1 };
        _mockAssetService.Setup(service => service.UpdateAssetAsync(existingId, assetDto))
                         .ReturnsAsync(true); // Simulate service returning true (update success)

        // Act
        var result = await _controller.UpdateAsset(existingId, assetDto);

        // Assert
        Assert.IsType<NoContentResult>(result);
        // Optionally verify the service method was called once
        _mockAssetService.Verify(service => service.UpdateAssetAsync(existingId, assetDto), Times.Once);
    }

    [Fact]
    public async Task UpdateAsset_WithInvalidModelState_ReturnsBadRequest()
    {
        // Arrange
        int validId = 1;
        var assetDto = new UpdateAssetDto { Name = "", Type = AssetType.Equipment, CustomerId = 1 }; // Example invalid DTO
        _controller.ModelState.AddModelError("Name", "The Name field is required."); // Manually add model error

        // Act
        var result = await _controller.UpdateAsset(validId, assetDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value); // Check if the value contains model state errors
        _mockAssetService.Verify(service => service.UpdateAssetAsync(It.IsAny<int>(), It.IsAny<UpdateAssetDto>()), Times.Never);
    }

    // --- DeleteAsset Tests --- 

    [Fact]
    public async Task DeleteAsset_WithInvalidId_ReturnsBadRequest()
    {
        // Arrange
        int invalidId = 0;

        // Act
        var result = await _controller.DeleteAsset(invalidId);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        _mockAssetService.Verify(service => service.DeleteAssetAsync(It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task DeleteAsset_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        int nonExistentId = 999;
        _mockAssetService.Setup(service => service.DeleteAssetAsync(nonExistentId))
                         .ReturnsAsync(false); // Simulate service returning false (not found)

        // Act
        var result = await _controller.DeleteAsset(nonExistentId);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task DeleteAsset_WithExistingId_ReturnsNoContent()
    {
        // Arrange
        int existingId = 1;
        _mockAssetService.Setup(service => service.DeleteAssetAsync(existingId))
                         .ReturnsAsync(true); // Simulate service returning true (delete success)

        // Act
        var result = await _controller.DeleteAsset(existingId);

        // Assert
        Assert.IsType<NoContentResult>(result);
        // Optionally verify the service method was called once
        _mockAssetService.Verify(service => service.DeleteAssetAsync(existingId), Times.Once);
    }
}