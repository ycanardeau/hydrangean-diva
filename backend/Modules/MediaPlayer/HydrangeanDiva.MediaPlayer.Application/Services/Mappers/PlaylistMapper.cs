using HydrangeanDiva.MediaPlayer.Application.Interfaces.Mappers;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.Entities;

namespace HydrangeanDiva.MediaPlayer.Application.Services.Mappers;

internal class PlaylistMapper : IPlaylistMapper
{
	public PlaylistDto Map(Playlist value)
	{
		return new PlaylistDto(
			Id: value.Id.Value,
			Name: value.Name.Value
		);
	}
}
