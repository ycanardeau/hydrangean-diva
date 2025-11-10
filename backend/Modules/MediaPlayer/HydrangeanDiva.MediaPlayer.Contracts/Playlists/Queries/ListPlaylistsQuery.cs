using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

namespace HydrangeanDiva.MediaPlayer.Contracts.Playlists.Queries;

public sealed record ListPlaylistsQuery() : IRequest<Result<ListPlaylistsResponseDto>>;
