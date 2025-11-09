using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Commands;

internal class CreatePlaylistCommandHandler : IRequestHandler<CreatePlaylistCommand, Result<CreatePlaylistResponseDto>>
{
	public Task<Result<CreatePlaylistResponseDto>> Handle(CreatePlaylistCommand request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
