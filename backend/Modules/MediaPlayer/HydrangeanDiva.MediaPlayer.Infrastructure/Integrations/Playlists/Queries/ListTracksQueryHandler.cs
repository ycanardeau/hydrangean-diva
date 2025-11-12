using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Queries;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Queries;

internal class ListTracksQueryHandler : IRequestHandler<ListTracksQuery, Result<ListTracksResponseDto>>
{
	public Task<Result<ListTracksResponseDto>> Handle(ListTracksQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
