using HydrangeanDiva.MediaPlayer.Application.Interfaces.Mappers;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Queries;
using HydrangeanDiva.MediaPlayer.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Queries;

internal class ListPlaylistsQueryHandler(
	ApplicationDbContext dbContext,
	IPlaylistMapper playlistMapper
) : IRequestHandler<ListPlaylistsQuery, Result<ListPlaylistsResponseDto>>
{
	public async Task<Result<ListPlaylistsResponseDto>> Handle(ListPlaylistsQuery request, CancellationToken cancellationToken)
	{
		var items = await dbContext.Playlists.AsNoTracking()
			.ToListAsync(cancellationToken);

		return new ListPlaylistsResponseDto(Items: [..items.Select(playlistMapper.Map)]);
	}
}
