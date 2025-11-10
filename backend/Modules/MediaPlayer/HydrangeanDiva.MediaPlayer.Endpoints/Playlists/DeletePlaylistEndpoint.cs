using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Endpoints.Playlists;

public class DeletePlaylistEndpoint(ISender sender) : ControllerBase
{
	[Tags("Media Player - Playlists")]
	[HttpDelete("/media-player/playlists/{id}")]
	[Produces<DeletePlaylistResponseDto>]
	public Task<IResult> HandleAsync(Guid id, CancellationToken ct)
	{
		return sender.Send(new DeletePlaylistCommand(Id: id), ct).ToMinimalApiResult();
	}
}
