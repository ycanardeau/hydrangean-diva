using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Queries;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Queries;

internal class GetPlaylistQueryHandler : IRequestHandler<GetPlaylistQuery, Result<GetPlaylistResponseDto>>
{
	public Task<Result<GetPlaylistResponseDto>> Handle(GetPlaylistQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
