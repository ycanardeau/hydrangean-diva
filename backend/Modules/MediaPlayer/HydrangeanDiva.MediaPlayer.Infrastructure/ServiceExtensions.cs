using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using HydrangeanDiva.MediaPlayer.Infrastructure.Persistence;

namespace HydrangeanDiva.MediaPlayer.Infrastructure;

file interface IInfrastructure;

internal static class ServiceExtensions
{
	public static IServiceCollection AddDbContext(this IHostApplicationBuilder builder)
	{
		return builder.Services.AddDbContext<ApplicationDbContext>(options =>
		{
			options.UseNpgsql(
				builder.Configuration.GetConnectionString("DefaultConnection"),
				sqlOptions =>
				{
					sqlOptions
						// https://learn.microsoft.com/en-us/samples/dotnet/aspire-samples/aspire-efcore-migrations/
						.MigrationsAssembly("HydrangeanDiva.MediaPlayer.MigrationService")
						// https://www.milanjovanovic.tech/blog/using-multiple-ef-core-dbcontext-in-single-application
						.MigrationsHistoryTable(tableName: HistoryRepository.DefaultTableName, schema: ApplicationDbContext.Schema);
				}
			);
		});
	}

	public static IHostApplicationBuilder AddInfrastructure(this IHostApplicationBuilder builder)
	{
		builder.Services.AddMediatR(config => config.RegisterServicesFromAssemblyContaining<IInfrastructure>());

		builder.AddDbContext();

		return builder;
	}
}
