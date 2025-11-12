using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Commands;

internal class ReplaceTracksCommandHandler : IRequestHandler<ReplaceTracksCommand, Result<ReplaceTracksResponseDto>>
{
	public Task<Result<ReplaceTracksResponseDto>> Handle(ReplaceTracksCommand request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
