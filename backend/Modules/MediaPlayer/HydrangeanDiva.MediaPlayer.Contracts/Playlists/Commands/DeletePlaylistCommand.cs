using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Contracts.Playlists.Commands;

public sealed record DeletePlaylistCommand(Guid Id) : IRequest<Result<DeletePlaylistResponseDto>>;
