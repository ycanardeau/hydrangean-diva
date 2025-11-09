using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;

public sealed record CreatePlaylistCommand(string Name) : IRequest<Result<CreatePlaylistResponseDto>>;
