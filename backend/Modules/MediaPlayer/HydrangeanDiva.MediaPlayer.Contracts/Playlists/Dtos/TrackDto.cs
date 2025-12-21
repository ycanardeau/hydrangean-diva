namespace HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;

public sealed record TrackDto(
	Guid Id,
	string Url,
	string Type,
	string VideoId,
	string Title
);
