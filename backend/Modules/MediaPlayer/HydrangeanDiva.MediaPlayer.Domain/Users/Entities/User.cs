using HydrangeanDiva.MediaPlayer.Domain.Common.Entities;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.Entities;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.ValueObjects;
using HydrangeanDiva.MediaPlayer.Domain.Users.ValueObjects;

namespace HydrangeanDiva.MediaPlayer.Domain.Users.Entities;

internal class User : Entity<UserId>
{
	public ICollection<Playlist> Playlists { get; set; } = [];

	public Playlist AddPlaylist(PlaylistName name)
	{
		var playlist = new Playlist
		{
			Id = new(Guid.CreateVersion7()),
			Owner = this,
			Name = name,
		};
		Playlists.Add(playlist);

		return playlist;
	}
}
