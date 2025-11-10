using HydrangeanDiva.MediaPlayer.Domain.Common.Entities;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.ValueObjects;

namespace HydrangeanDiva.MediaPlayer.Domain.Playlists.Entities;

internal class Playlist : Entity<PlaylistId>
{
	public required PlaylistName Name { get; set; }
}
