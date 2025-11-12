using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Queries;

namespace HydrangeanDiva.MediaPlayer.Endpoints.Playlists;

public class ListTracksEndpoint(ISender sender) : ControllerBase
{
	[Tags("Media Player - Playlists")]
	[HttpGet("/media-player/playlists/{id}/tracks")]
	[Produces<ListTracksResponseDto>]
	public Task<IResult> HandleAsync(Guid id, CancellationToken ct)
	{
		return sender.Send(new ListTracksQuery(Id: id), ct).ToMinimalApiResult();
	}
}
