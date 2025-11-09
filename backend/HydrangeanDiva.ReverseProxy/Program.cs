using Yarp.ReverseProxy.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.

RouteConfig[] GetRoutes()
{
	return [
		new RouteConfig
		{
			RouteId = "Route1",
			ClusterId = "default",
			Match = new RouteMatch { Path = "{**catch-all}" },
		},
		new RouteConfig
		{
			RouteId = "Route2",
			ClusterId = "api",
			Match = new RouteMatch { Path = "/api/{*any}" },
			Transforms = [
				new Dictionary<string, string>
				{
					{ "PathRemovePrefix", "/api" }
				},
			],
		},
	];
}

ClusterConfig[] GetClusters()
{
	return [
		new ClusterConfig
		{
			ClusterId = "default",
			Destinations = new Dictionary<string, DestinationConfig>
			{
				{ "destination1", new DestinationConfig { Address = "http://frontend" } },
			},
		},
		new ClusterConfig
		{
			ClusterId = "api",
			Destinations = new Dictionary<string, DestinationConfig>
			{
				{ "destination2", new DestinationConfig { Address = "https://hydrangeandiva", Host = "localhost" } },
			},
		},
	];
}

builder.Services.AddReverseProxy()
	.LoadFromMemory(GetRoutes(), GetClusters())
	.AddServiceDiscoveryDestinationResolver();

var app = builder.Build();

app.MapDefaultEndpoints();

app.MapReverseProxy();

app.Run();
