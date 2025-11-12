using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Endpoints.Playlists;

public class ReplaceTracksEndpoint(ISender sender) : ControllerBase
{
	[Tags("Media Player - Playlists")]
	[HttpPut("/media-player/playlists/{id}/tracks")]
	[Produces<ReplaceTracksResponseDto>]
	public Task<IResult> HandleAsync(Guid id, CancellationToken ct)
	{
		return sender.Send(new ReplaceTracksCommand(Id: id), ct).ToMinimalApiResult();
	}
}
