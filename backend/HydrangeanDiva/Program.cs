using Microsoft.AspNetCore.Mvc;

// https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-8.0#attribute-on-an-assembly
[assembly: ApiController]
var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

HydrangeanDiva.MediaPlayer.Module.ServiceExtensions.AddModule(builder);

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
