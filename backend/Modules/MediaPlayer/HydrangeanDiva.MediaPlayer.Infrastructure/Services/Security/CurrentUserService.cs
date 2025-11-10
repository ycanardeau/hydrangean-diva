using HydrangeanDiva.MediaPlayer.Application.Interfaces.Security;
using HydrangeanDiva.MediaPlayer.Domain.Users.ValueObjects;

namespace HydrangeanDiva.MediaPlayer.Infrastructure.Services.Security;

internal class CurrentUserService : ICurrentUserService
{
	public UserId? CurrentUserId => new(new Guid("00000000-0000-0000-0000-000000000001"))/* TODO: implement */;
}
