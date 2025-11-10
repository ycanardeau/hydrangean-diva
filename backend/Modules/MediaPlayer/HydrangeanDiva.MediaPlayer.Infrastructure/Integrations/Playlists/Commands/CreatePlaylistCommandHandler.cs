using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Infrastructure.Persistence;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Commands;

internal class CreatePlaylistCommandHandler(ApplicationDbContext dbContext) : IRequestHandler<CreatePlaylistCommand, Result<CreatePlaylistResponseDto>>
{
	public Task<Result<CreatePlaylistResponseDto>> Handle(CreatePlaylistCommand request, CancellationToken cancellationToken)
	{
		return dbContext.GetCurrentUserResultAsync(cancellationToken)
			.Tap(x => x.AddPlaylist(new(request.Name)))
			.Tap(x => dbContext.SaveChangesAsync(cancellationToken))
			.Map(x => new CreatePlaylistResponseDto());
	}
}
