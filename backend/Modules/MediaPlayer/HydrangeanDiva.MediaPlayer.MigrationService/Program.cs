using HydrangeanDiva.MediaPlayer.MigrationService;
using HydrangeanDiva.MediaPlayer.Module;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddHostedService<Worker>();

builder.AddModule();

var host = builder.Build();
host.Run();
