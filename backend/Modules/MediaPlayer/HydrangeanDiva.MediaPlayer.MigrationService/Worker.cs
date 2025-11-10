using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using HydrangeanDiva.MediaPlayer.Infrastructure.Persistence;

namespace HydrangeanDiva.MediaPlayer.MigrationService;

public class Worker(
	IServiceProvider serviceProvider,
	IHostApplicationLifetime hostApplicationLifetime
) : BackgroundService
{
	public const string ActivitySourceName = "Migrations";
	private static readonly ActivitySource s_activitySource = new(ActivitySourceName);

	private static async Task EnsureDatabaseAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken)
	{
		var dbCreator = dbContext.GetService<IRelationalDatabaseCreator>();

		var strategy = dbContext.Database.CreateExecutionStrategy();
		await strategy.ExecuteAsync(async () =>
		{
			// Create the database if it does not exist.
			// Do this first so there is then a database to start a transaction against.
			if (!await dbCreator.ExistsAsync(cancellationToken))
			{
				await dbCreator.CreateAsync(cancellationToken);
			}
		});
	}

	private static Task RunMigrationAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken)
	{
		// https://github.com/dotnet/EntityFramework.Docs/blob/422810f5bb0004f8c5ec70219c13a9884ff8f9d9/entity-framework/core/what-is-new/ef-core-9.0/breaking-changes.md#migrations-transaction
		return dbContext.Database.MigrateAsync(cancellationToken);
	}

	protected override async Task ExecuteAsync(CancellationToken cancellationToken)
	{
		using var activity = s_activitySource.StartActivity("Migrating database", ActivityKind.Client);

		try
		{
			using var scope = serviceProvider.CreateScope();
			var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

			await EnsureDatabaseAsync(dbContext, cancellationToken);
			await RunMigrationAsync(dbContext, cancellationToken);
		}
		catch (Exception ex)
		{
			activity?.AddException(ex);
			throw;
		}

		hostApplicationLifetime.StopApplication();
	}
}
