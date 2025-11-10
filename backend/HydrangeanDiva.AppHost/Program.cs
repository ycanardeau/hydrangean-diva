using Microsoft.Extensions.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var hydrangeanDivaDb = builder.AddPostgres("postgres")
	.WithDataVolume()
	.WithPgAdmin()
	.AddDatabase("DefaultConnection", "HydrangeanDiva");

var api = builder.AddProject<Projects.HydrangeanDiva>("hydrangeandiva")
	.WithReference(hydrangeanDivaDb);

var frontend = builder.AddNpmApp(name: "frontend", workingDirectory: "../../frontend/hydrangean-diva", scriptName: "dev")
	.WithHttpEndpoint(env: "PORT")
	.WithExternalHttpEndpoints()
	.WithReference(api)
	.WaitFor(api);

if (builder.Environment.IsDevelopment() && builder.Configuration["DOTNET_LAUNCH_PROFILE"] == "https")
{
	frontend.WithEnvironment("NODE_TLS_REJECT_UNAUTHORIZED", "0");
}

builder.AddProject<Projects.HydrangeanDiva_ReverseProxy>("hydrangeandiva-reverseproxy")
	.WithReference(frontend)
	.WithReference(api)
	.WaitFor(frontend)
	.WaitFor(api);

builder.Build().Run();
