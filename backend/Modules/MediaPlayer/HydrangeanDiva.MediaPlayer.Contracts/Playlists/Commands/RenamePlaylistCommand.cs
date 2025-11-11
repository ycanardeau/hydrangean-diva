using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;

public sealed record RenamePlaylistCommand(
	Guid Id,
	string Name
) : IRequest<Result<RenamePlaylistResponseDto>>;
