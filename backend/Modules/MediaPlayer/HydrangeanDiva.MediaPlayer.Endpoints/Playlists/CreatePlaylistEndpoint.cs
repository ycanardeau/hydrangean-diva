using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Endpoints.Playlists;

public sealed record CreatePlaylistRequest(
	string Name
);

public class CreatePlaylistEndpoint(ISender sender) : ControllerBase
{
	[Tags("Media Player - Playlists")]
	[HttpPost("/media-player/playlists")]
	[Produces<CreatePlaylistResponseDto>]
	public Task<IResult> HandleAsync([FromBody] CreatePlaylistRequest req, CancellationToken ct)
	{
		return sender.Send(new CreatePlaylistCommand(
			Name: req.Name
		), ct).ToMinimalApiResult();
	}
}
