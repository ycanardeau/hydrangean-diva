namespace HydrangeanDiva.MediaPlayer.Domain.Common.Interfaces;

// https://learn.microsoft.com/en-us/ef/core/logging-events-diagnostics/events
internal interface IHasTimestamps
{
	DateTimeOffset CreatedAt { get; set; }
	DateTimeOffset UpdatedAt { get; set; }
}
