using HydrangeanDiva.MediaPlayer.Domain.Users.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Persistence.Configurations;

internal class UserConfiguration : IEntityTypeConfiguration<User>
{
	public void Configure(EntityTypeBuilder<User> builder)
	{
		builder.HasKey(x => x.Id);

		builder.Property(x => x.Id)
			.HasConversion(x => x.Value, x => new(x));
	}
}
