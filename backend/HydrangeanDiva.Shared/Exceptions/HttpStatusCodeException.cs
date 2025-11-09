using System.Net;

namespace HydrangeanDiva.Shared.Exceptions;

public abstract class HttpStatusCodeException(HttpStatusCode statusCode) : Exception
{
	public HttpStatusCode StatusCode { get; } = statusCode;
}

public sealed class BadRequestException() : HttpStatusCodeException(HttpStatusCode.BadRequest);
public sealed class UnauthorizedException() : HttpStatusCodeException(HttpStatusCode.Unauthorized);
public sealed class ForbiddenException() : HttpStatusCodeException(HttpStatusCode.Forbidden);
public sealed class NotFoundException() : HttpStatusCodeException(HttpStatusCode.NotFound);
public sealed class UnprocessableEntityException() : HttpStatusCodeException(HttpStatusCode.UnprocessableEntity);
