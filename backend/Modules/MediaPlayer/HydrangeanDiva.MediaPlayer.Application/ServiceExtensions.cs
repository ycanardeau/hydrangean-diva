using FluentValidation;
using HydrangeanDiva.MediaPlayer.Application.Interfaces.Mappers;
using HydrangeanDiva.MediaPlayer.Application.Services.Mappers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace HydrangeanDiva.MediaPlayer.Application;

file interface IApplication;

internal static class ServiceExtensions
{
	public static IHostApplicationBuilder AddApplication(this IHostApplicationBuilder builder)
	{
		builder.Services.AddValidatorsFromAssemblyContaining<IApplication>(includeInternalTypes: true);

		builder.Services.AddScoped<IPlaylistMapper, PlaylistMapper>();

		return builder;
	}
}
