using HydrangeanDiva.MediaPlayer.Domain.Common.Entities;
using HydrangeanDiva.MediaPlayer.Domain.Users.Interfaces;
using HydrangeanDiva.MediaPlayer.Domain.Users.ValueObjects;

namespace HydrangeanDiva.MediaPlayer.Domain.Users.Entities;

internal abstract class UserOwnedEntity<TId> : Entity<TId>, IUserOwnedEntity
	where TId : struct
{
	public UserId OwnerId { get; set; }
	public required User Owner { get; set; }
}
