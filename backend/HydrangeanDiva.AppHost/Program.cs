var builder = DistributedApplication.CreateBuilder(args);

builder.AddNpmApp(name: "frontend", workingDirectory: "../../frontend/hydrangean-diva", scriptName: "dev")
	.WithHttpEndpoint(env: "PORT")
	.WithExternalHttpEndpoints();

builder.AddProject<Projects.HydrangeanDiva_Silo>("hydrangeandiva-silo");

builder.Build().Run();
