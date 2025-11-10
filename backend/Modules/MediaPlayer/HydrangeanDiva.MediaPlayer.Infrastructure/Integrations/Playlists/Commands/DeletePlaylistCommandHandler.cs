using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.Entities;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.ValueObjects;
using HydrangeanDiva.MediaPlayer.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Commands;

internal class DeletePlaylistCommandHandler(ApplicationDbContext dbContext) : IRequestHandler<DeletePlaylistCommand, Result<DeletePlaylistResponseDto>>
{
	private async Task<Result<Playlist>> GetPlaylistAsync(PlaylistId id, CancellationToken cancellationToken)
	{
		var playlist = await dbContext.Playlists.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

		return playlist is null
			? NotFound<Playlist>()
			: playlist;
	}

	public Task<Result<DeletePlaylistResponseDto>> Handle(DeletePlaylistCommand request, CancellationToken cancellationToken)
	{
		return GetPlaylistAsync(new PlaylistId(request.Id), cancellationToken)
			.Tap(x => dbContext.Playlists.Remove(x))
			.Tap(x => dbContext.SaveChangesAsync(cancellationToken))
			.Map(x => new DeletePlaylistResponseDto());
	}
}
