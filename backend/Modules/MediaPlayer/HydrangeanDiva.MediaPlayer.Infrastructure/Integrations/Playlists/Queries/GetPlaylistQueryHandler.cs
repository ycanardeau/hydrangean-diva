using HydrangeanDiva.MediaPlayer.Application.Interfaces.Mappers;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Queries;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.ValueObjects;
using HydrangeanDiva.MediaPlayer.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Queries;

internal class GetPlaylistQueryHandler(
	ApplicationDbContext dbContext,
	IPlaylistMapper playlistMapper
) : IRequestHandler<GetPlaylistQuery, Result<GetPlaylistResponseDto>>
{
	public async Task<Result<GetPlaylistResponseDto>> Handle(GetPlaylistQuery request, CancellationToken cancellationToken)
	{
		var playlist = await dbContext.Playlists
			.AsNoTracking()
			.SingleOrDefaultAsync(x => x.Id == new PlaylistId(request.Id), cancellationToken);

		if (playlist is null)
		{
			return NotFound<GetPlaylistResponseDto>();
		}

		return new GetPlaylistResponseDto(Playlist: playlistMapper.Map(playlist));
	}
}
