using HydrangeanDiva.Silo.Extensions;

namespace HydrangeanDiva.Silo.Services;

public class BaseClusterService(IHttpContextAccessor httpContextAccessor, IClusterClient client)
{
	protected T TryUseGrain<TGrainInterface, T>(Func<TGrainInterface, T> useGrain, string? key, Func<T> defaultValue)
		where TGrainInterface : IGrainWithStringKey
	{
		return key is { Length: > 0 } primaryKey
			? useGrain(client.GetGrain<TGrainInterface>(primaryKey))
			: defaultValue();
	}

	protected T TryUseGrain<TGrainInterface, T>(Func<TGrainInterface, T> useGrain, Func<T> defaultValue)
		where TGrainInterface : IGrainWithStringKey
	{
		return TryUseGrain(useGrain, httpContextAccessor.TryGetUserId(), defaultValue);
	}
}
