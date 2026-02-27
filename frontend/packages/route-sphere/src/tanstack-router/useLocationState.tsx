import type { IStateAccessor } from '@/components/IStateAccessor';
import type { IStateCodec } from '@/components/IStateCodec';
import type { IStateHandlerOptions } from '@/components/IStateHandlerOptions';
import { useStateHandler } from '@/components/useStateHandler';
import type { IStateStore } from '@/stores/IStateStore';
import { useStableLocation } from '@/tanstack-router/useStableLocation';
import { useNavigate } from '@tanstack/react-router';
import { type ParsedQs, parse } from 'qs';
import { useCallback, useMemo } from 'react';

const useLocationStateDeserializer = (): (() => ParsedQs) => {
	const { location } = useStableLocation();

	// Pass `location` as deps instead of `location.search`.
	return useCallback((): ParsedQs => parse(location.slice(1)), [location]);
};

const useLocationStateSerializer = <TState,>(): ((state: TState) => void) => {
	const navigate = useNavigate();

	return useCallback(
		async (state: TState): Promise<void> => {
			await navigate({ search: state as any /* FIXME */ });
		},
		[navigate],
	);
};

const useLocationStateCodec = <TState,>(): IStateCodec<TState> => {
	const deserializer = useLocationStateDeserializer();
	const serializer = useLocationStateSerializer();
	const codec = useMemo(
		(): IStateCodec<TState> => ({
			deserialize: deserializer,
			serialize: serializer,
		}),
		[deserializer, serializer],
	);
	return codec;
};

/** Updates a store that implements the {@link LocationStateStore} interface when a route changes, and vice versa. */
const useLocationStateHandler = <TState,>(
	validator: (state: unknown) => state is TState,
	accessor: IStateAccessor<TState>,
	options: IStateHandlerOptions<TState>,
): void => {
	const codec = useLocationStateCodec();
	useStateHandler(codec, validator, accessor, options);
};

const useLocationStateGetter = <TState,>(
	store: IStateStore<TState>,
): (() => TState) => {
	return useCallback(() => store.state, [store]);
};

const useLocationStateSetter = <TState,>(
	store: IStateStore<TState>,
): ((state: TState) => void) => {
	return useCallback(
		(state: TState) => {
			store.state = state;
		},
		[store],
	);
};

const useLocationStateAccessor = <TState,>(
	store: IStateStore<TState>,
): IStateAccessor<TState> => {
	const getter = useLocationStateGetter(store);
	const setter = useLocationStateSetter(store);
	const accessor = useMemo(
		(): IStateAccessor<TState> => ({ get: getter, set: setter }),
		[getter, setter],
	);
	return accessor;
};

/** Updates a store that implements the {@link LocationStateStore} interface when a route changes, and vice versa. */
export const useLocationState = <TState,>(store: IStateStore<TState>): void => {
	const accessor = useLocationStateAccessor(store);
	const options = useMemo(
		() => ({
			onStateRestore: store.onStateRestore,
			onStateChange: store.onStateChange,
			onStateSave: store.onStateSave,
		}),
		[store],
	);
	useLocationStateHandler(store.validateState, accessor, options);
};
