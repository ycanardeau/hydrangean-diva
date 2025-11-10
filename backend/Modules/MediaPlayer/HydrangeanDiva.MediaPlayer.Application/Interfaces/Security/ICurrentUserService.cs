using HydrangeanDiva.MediaPlayer.Domain.Users.ValueObjects;

namespace HydrangeanDiva.MediaPlayer.Application.Interfaces.Security;

internal interface ICurrentUserService
{
	UserId? CurrentUserId { get; }
}
