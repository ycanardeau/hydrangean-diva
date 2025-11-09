using FluentValidation;
using Microsoft.Extensions.Hosting;

namespace HydrangeanDiva.MediaPlayer.Application;

file interface IApplication;

internal static class ServiceExtensions
{
	public static IHostApplicationBuilder AddApplication(this IHostApplicationBuilder builder)
	{
		builder.Services.AddValidatorsFromAssemblyContaining<IApplication>(includeInternalTypes: true);

		return builder;
	}
}
