using HydrangeanDiva.MediaPlayer.Domain.Common.Interfaces;

namespace HydrangeanDiva.MediaPlayer.Domain.Common.Entities;

internal abstract class Entity : IHasTimestamps
{
	public DateTimeOffset CreatedAt { get; set; }
	public DateTimeOffset UpdatedAt { get; set; }
}

internal abstract class Entity<TId> : Entity
	where TId : struct
{
	public TId Id { get; set; }
}
