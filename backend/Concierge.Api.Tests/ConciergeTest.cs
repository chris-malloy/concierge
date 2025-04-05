using Microsoft.AspNetCore.Mvc.Testing;

namespace Concierge.Api.Tests;

// Use IClassFixture to share the factory instance across tests in this class
public class ConciergeTest : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    // Constructor receives the factory instance via dependency injection
    public ConciergeTest(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetRoot_ReturnsSuccessAndWelcomeMessage()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/");

        // Assert
        response.EnsureSuccessStatusCode(); // Status Code 200-299
        var responseString = await response.Content.ReadAsStringAsync();
        Assert.Equal("Welcome to the Concierge API!", responseString);
    }

    [Fact]
    public async Task GetHealthz_ReturnsSuccessAndHealthyStatus()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/healthz");

        // Assert
        response.EnsureSuccessStatusCode(); // Status Code 200-299
        var responseString = await response.Content.ReadAsStringAsync();
        Assert.Equal("Healthy", responseString);
    }
}