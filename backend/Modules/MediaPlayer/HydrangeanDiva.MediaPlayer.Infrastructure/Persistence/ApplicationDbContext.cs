using HydrangeanDiva.MediaPlayer.Domain.Common.Interfaces;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.Entities;
using HydrangeanDiva.MediaPlayer.Domain.Users.Entities;
using Microsoft.EntityFrameworkCore;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Persistence;

internal class ApplicationDbContext(
	DbContextOptions<ApplicationDbContext> options,
	TimeProvider timeProvider
) : DbContext(options)
{
	public static string Schema { get; } = "MediaPlayer";

	public DbSet<User> Users { get; set; }
	public DbSet<Playlist> Playlists { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.HasDefaultSchema(Schema);
		modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
		base.OnModelCreating(modelBuilder);
	}

	public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
	{
		var utcNow = timeProvider.GetUtcNow();

		foreach (var entry in ChangeTracker.Entries<IHasTimestamps>())
		{
			if (entry.State == EntityState.Added)
			{
				entry.Property(x => x.CreatedAt)
					.CurrentValue = utcNow;
				entry.Property(x => x.UpdatedAt)
					.CurrentValue = utcNow;
			}

			if (entry.State == EntityState.Modified)
			{
				entry.Property(x => x.UpdatedAt)
					.CurrentValue = utcNow;
			}
		}

		return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
	}
}
