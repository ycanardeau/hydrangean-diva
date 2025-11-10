using HydrangeanDiva.EntityFrameworkCore.Shared.Extensions;
using HydrangeanDiva.MediaPlayer.Application.Interfaces.Security;
using HydrangeanDiva.MediaPlayer.Domain.Common.Interfaces;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.Entities;
using HydrangeanDiva.MediaPlayer.Domain.Users.Entities;
using HydrangeanDiva.MediaPlayer.Domain.Users.Interfaces;
using HydrangeanDiva.MediaPlayer.Domain.Users.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Persistence;

internal class ApplicationDbContext(
	DbContextOptions<ApplicationDbContext> options,
	TimeProvider timeProvider,
	ICurrentUserService currentUserService
) : DbContext(options)
{
	public static string Schema { get; } = "MediaPlayer";

	private readonly UserId? _currentUserId = currentUserService.CurrentUserId;

	public DbSet<User> Users { get; set; }
	public DbSet<Playlist> Playlists { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.HasDefaultSchema(Schema);
		modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
		base.OnModelCreating(modelBuilder);

		modelBuilder.ApplyGlobalFilters<IUserOwnedEntity>(x => x.OwnerId == _currentUserId);
		// NB: Do not apply multiple global filters. See also https://github.com/dotnet/efcore/issues/10275.
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

	private async Task<User?> GetCurrentUserAsync(CancellationToken cancellationToken)
	{
		if (_currentUserId is null)
		{
			return null;
		}

		var user = await Users
			.AsNoTracking()
			.SingleOrDefaultAsync(x => x.Id == _currentUserId, cancellationToken);

		return user;
	}

	public async Task<Result<User>> GetCurrentUserResultAsync(CancellationToken cancellationToken)
	{
		return await GetCurrentUserAsync(cancellationToken) is not User user
			? NotFound<User>()
			: user;
	}
}
