using Nut.Results;
using HydrangeanDiva.Shared.Exceptions;

namespace HydrangeanDiva.Shared.Extensions;

public static class ResultExtensions
{
	public static Result BadRequest()
	{
		return Result.Error(new BadRequestException());
	}

	public static Result<T> BadRequest<T>()
	{
		return Result.Error<T>(new BadRequestException());
	}

	public static Result Unauthorized()
	{
		return Result.Error(new UnauthorizedException());
	}

	public static Result<T> Unauthorized<T>()
	{
		return Result.Error<T>(new UnauthorizedException());
	}

	public static Result Forbidden()
	{
		return Result.Error(new ForbiddenException());
	}

	public static Result<T> Forbidden<T>()
	{
		return Result.Error<T>(new ForbiddenException());
	}

	public static Result NotFound()
	{
		return Result.Error(new NotFoundException());
	}

	public static Result<T> NotFound<T>()
	{
		return Result.Error<T>(new NotFoundException());
	}

	public static Result UnprocessableEntity()
	{
		return Result.Error(new UnprocessableEntityException());
	}

	public static Result<T> UnprocessableEntity<T>()
	{
		return Result.Error<T>(new UnprocessableEntityException());
	}
}
