using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Commands;

internal class DeletePlaylistCommandHandler : IRequestHandler<DeletePlaylistCommand, Result<DeletePlaylistResponseDto>>
{
	public Task<Result<DeletePlaylistResponseDto>> Handle(DeletePlaylistCommand request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
