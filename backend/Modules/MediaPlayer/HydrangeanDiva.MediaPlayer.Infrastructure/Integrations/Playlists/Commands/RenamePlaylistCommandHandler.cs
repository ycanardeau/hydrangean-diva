using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.Entities;
using HydrangeanDiva.MediaPlayer.Domain.Playlists.ValueObjects;
using HydrangeanDiva.MediaPlayer.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Commands;

internal class RenamePlaylistCommandHandler(ApplicationDbContext dbContext) : IRequestHandler<RenamePlaylistCommand, Result<RenamePlaylistResponseDto>>
{
	private async Task<Result<Playlist>> GetPlaylistAsync(PlaylistId id, CancellationToken cancellationToken)
	{
		var playlist = await dbContext.Playlists.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

		return playlist is null
			? NotFound<Playlist>()
			: playlist;
	}

	public Task<Result<RenamePlaylistResponseDto>> Handle(RenamePlaylistCommand request, CancellationToken cancellationToken)
	{
		return GetPlaylistAsync(new PlaylistId(request.Id), cancellationToken)
			.Tap(x => x.Rename(new(request.Name)))
			.Tap(x => dbContext.SaveChangesAsync(cancellationToken))
			.Map(x => new RenamePlaylistResponseDto());
	}
}
