namespace HydrangeanDiva.Abstractions;

[GenerateSerializer, Immutable]
[Alias("HydrangeanDiva.Abstractions.PlayQueueItem")]
public sealed record PlayQueueItem(
	string Url,
	PlayerType Type,
	string VideoId,
	string Title
);
