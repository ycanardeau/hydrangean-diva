using Microsoft.Extensions.Hosting;
using HydrangeanDiva.MediaPlayer.Application;
using HydrangeanDiva.MediaPlayer.Endpoints;
using HydrangeanDiva.MediaPlayer.Infrastructure;

namespace HydrangeanDiva.MediaPlayer.Module;

internal static class ServiceExtensions
{
	public static IHostApplicationBuilder AddModule(this IHostApplicationBuilder builder)
	{
		builder.AddApplication();
		builder.AddInfrastructure();
		builder.Services.AddEndpoints();
		return builder;
	}
}
