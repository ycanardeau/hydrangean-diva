using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;

public sealed record ReplaceTracksCommand(
	Guid Id
) : IRequest<Result<ReplaceTracksResponseDto>>;
