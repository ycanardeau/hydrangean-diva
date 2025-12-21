using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Dtos;
using HydrangeanDiva.MediaPlayer.Contracts.Playlists.Queries;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Integrations.Playlists.Queries;

internal class ListTracksQueryHandler : IRequestHandler<ListTracksQuery, Result<ListTracksResponseDto>>
{
	public Task<Result<ListTracksResponseDto>> Handle(ListTracksQuery request, CancellationToken cancellationToken)
	{
		return Task.FromResult(Result.Ok(new ListTracksResponseDto(
			Items: [
				new TrackDto(
					Id: new Guid("00000000-0000-0000-0000-000000000002"),
					Url: "https://www.youtube.com/watch?v=jUe7dDLGpv8",
					Type: "YouTube",
					VideoId: "jUe7dDLGpv8",
					Title: "2nd Album「Hydrangean Diva」/Nejishiki【Trailer】"
				),
				new TrackDto(
					Id: new Guid("00000000-0000-0000-0000-000000000001"),
					Url: "https://www.youtube.com/watch?v=bGdtvUQ9OAs",
					Type: "YouTube",
					VideoId: "bGdtvUQ9OAs",
					Title: "3rd Album「nostalgic diva」Nejishiki【Trailer】 /3rd Album「nostalgic diva」/ねじ式【クロスフェード】"
				),
				new TrackDto(
					Id: new Guid("00000000-0000-0000-0000-000000000003"),
					Url: "https://www.youtube.com/watch?v=URMyCRPbn7o",
					Type: "YouTube",
					VideoId: "URMyCRPbn7o",
					Title: "【ねじ式】Best Album「BEST OF DIVA」/【クロスフェード】/【nejishiki】Greatest Hits Album「BEST OF DIVA」/【Trailer】"
				),
			]
		)));
	}
}
