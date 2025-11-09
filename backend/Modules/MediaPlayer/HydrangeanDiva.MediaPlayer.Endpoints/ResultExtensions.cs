using System.Diagnostics;
using HydrangeanDiva.Shared.Exceptions;

namespace HydrangeanDiva.MediaPlayer.Endpoints;

internal static class ResultExtensions
{
	private static IResult ToMinimalApiResult<T>(this Result<T> result)
	{
		return result.Match<T, IResult>(
			ok: x => TypedResults.Ok(x),
			err: x => x switch
			{
				BadRequestException => TypedResults.BadRequest(),
				UnauthorizedException => TypedResults.Unauthorized(),
				ForbiddenException => TypedResults.Forbid(),
				NotFoundException => TypedResults.NotFound(),
				UnprocessableEntityException => TypedResults.UnprocessableEntity(),
				_ => throw new UnreachableException()
			}
		).Get();
	}

	public static async Task<IResult> ToMinimalApiResult<T>(this Task<Result<T>> result)
    {
		return (await result).ToMinimalApiResult();
    }
}
