using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Contracts.Playlists.Queries;

public sealed record GetPlaylistQuery(Guid Id) : IRequest<Result<GetPlaylistResponseDto>>;
