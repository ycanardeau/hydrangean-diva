using HydrangeanDiva.MediaPlayer.Domain.Users.ValueObjects;

namespace HydrangeanDiva.MediaPlayer.Domain.Users.Interfaces;

internal interface IUserOwnedEntity
{
	UserId OwnerId { get; }
}
