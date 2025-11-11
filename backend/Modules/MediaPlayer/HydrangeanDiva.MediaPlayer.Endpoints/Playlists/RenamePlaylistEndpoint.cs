using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Endpoints.Playlists;

public sealed record RenamePlaylistRequest(
	string Name
);

public class RenamePlaylistEndpoint(ISender sender) : ControllerBase
{
	[Tags("Media Player - Playlists")]
	[HttpPost("/media-player/playlists/{id}:rename")]
	[Produces<RenamePlaylistResponseDto>]
	public Task<IResult> HandleAsync(Guid id, [FromBody] RenamePlaylistRequest req, CancellationToken ct)
	{
		return sender.Send(new RenamePlaylistCommand(
			Id: id,
			Name: req.Name
		), ct).ToMinimalApiResult();
	}
}
