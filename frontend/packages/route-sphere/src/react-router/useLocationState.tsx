import type { IStateAccessor } from '@/components/IStateAccessor';
import type { IStateCodec } from '@/components/IStateCodec';
import { useStateHandler } from '@/components/useStateHandler';
import type { IStateStore } from '@/stores/IStateStore';
import type { StateChangeEvent } from '@/stores/StateChangeEvent';
import { type ParsedQs, parse, stringify } from 'qs';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useLocationStateDeserializer = (): (() => ParsedQs) => {
	const location = useLocation();

	// Pass `location` as deps instead of `location.search`.
	return useCallback(
		(): ParsedQs => parse(location.search.slice(1)),
		[location],
	);
};

const useLocationStateSerializer = <TState,>(): ((state: TState) => void) => {
	const navigate = useNavigate();

	return useCallback(
		async (state: TState): Promise<void> => {
			const newUrl = `?${stringify(state)}`;
			await navigate(newUrl);
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
	onStateChange: ((event: StateChangeEvent<TState>) => void) | undefined,
): void => {
	const codec = useLocationStateCodec();
	useStateHandler(codec, validator, accessor, onStateChange);
};

const useLocationStateGetter = <TState,>(
	store: IStateStore<TState>,
): (() => TState) => {
	return useCallback((): TState => store.state, [store]);
};

const useLocationStateSetter = <TState,>(
	store: IStateStore<TState>,
): ((state: TState) => void) => {
	return useCallback(
		(state: TState): void => {
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
	useLocationStateHandler(store.validateState, accessor, store.onStateChange);
};
