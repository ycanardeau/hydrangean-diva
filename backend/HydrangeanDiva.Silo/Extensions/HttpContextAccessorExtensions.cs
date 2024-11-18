using System.Security.Claims;

namespace HydrangeanDiva.Silo.Extensions;

internal static class HttpContextAccessorExtensions
{
	internal static string? TryGetUserId(this IHttpContextAccessor? httpContextAccessor)
	{
		return httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "demo-shared-user";
	}
}
