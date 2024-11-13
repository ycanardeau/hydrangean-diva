var builder = DistributedApplication.CreateBuilder(args);

builder.AddNpmApp(name: "frontend", workingDirectory: "../../frontend/hydrangean-diva", scriptName: "dev")
	.WithHttpEndpoint(env: "PORT")
	.WithExternalHttpEndpoints();

builder.Build().Run();
