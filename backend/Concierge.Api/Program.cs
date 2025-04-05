using Concierge.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Define CORS policy name
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          // Replace with your frontend's actual URL in production/other environments
                          policy.WithOrigins("http://localhost:3000")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

// Register custom services
builder.Services.AddScoped<IAssetService, AssetService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => "Welcome to the Concierge API!");
app.MapHealthChecks("/healthz");

app.Run();

// Remove unused weather forecast code
// record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
// {
//     public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
// }

// Make the implicit Program class public so it can be used by WebApplicationFactory in tests
public partial class Program { }
