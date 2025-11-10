using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Queries;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Queries;

internal class ListPlaylistsQueryHandler : IRequestHandler<ListPlaylistsQuery, Result<ListPlaylistsResponseDto>>
{
	public Task<Result<ListPlaylistsResponseDto>> Handle(ListPlaylistsQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
