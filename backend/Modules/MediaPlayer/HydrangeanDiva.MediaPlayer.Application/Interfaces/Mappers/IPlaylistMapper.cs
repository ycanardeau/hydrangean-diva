using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.Entities;

namespace HydrangeanDiva.MediaPlayer.Application.Interfaces.Mappers;

internal interface IPlaylistMapper
{
	PlaylistDto Map(Playlist value);
}
