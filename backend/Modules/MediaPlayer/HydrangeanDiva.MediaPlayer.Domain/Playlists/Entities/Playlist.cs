using HydrangeanDiva.MediaPlayer.Domain.Playlists.ValueObjects;
using HydrangeanDiva.MediaPlayer.Domain.Users.Entities;

namespace HydrangeanDiva.MediaPlayer.Domain.Playlists.Entities;

internal class Playlist : UserOwnedEntity<PlaylistId>
{
	public required PlaylistName Name { get; set; }

	public void Rename(PlaylistName value)
    {
		Name = value;
    }
}
