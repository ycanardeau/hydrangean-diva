using HydrangeanDiva.MediaPlayer.Domain.Playlists.Entities;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Persistence.Configurations;

internal class PlaylistConfiguration : IEntityTypeConfiguration<Playlist>
{
	public void Configure(EntityTypeBuilder<Playlist> builder)
	{
		builder.HasKey(x => x.Id);

		builder.Property(x => x.Id)
			.HasConversion(x => x.Value, x => new(x));

		builder.Property(x => x.Name)
			.HasConversion(x => x.Value, x => new(x))
			.HasMaxLength(PlaylistName.MaxLength);
	}
}
