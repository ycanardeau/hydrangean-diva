using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Queries;

namespace HydrangeanDiva.MediaPlayer.Endpoints.Playlists;

public class ListPlaylistsEndpoint(ISender sender) : ControllerBase
{
	[Tags("Media Player - Playlists")]
	[HttpGet("/media-player/playlists")]
	[Produces<ListPlaylistsResponseDto>]
	public Task<IResult> HandleAsync(CancellationToken ct)
	{
		return sender.Send(new ListPlaylistsQuery(), ct).ToMinimalApiResult();
	}
}
