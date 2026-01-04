import { useStateHandler } from '@/components/useStateHandler';
import type { IReactiveStateStore } from '@/stores/IReactiveStateStore';
import type { StateChangeEvent } from '@/stores/StateChangeEvent';
import { type ParsedQs, parse, stringify } from 'qs';
import { useCallback } from 'react';
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

/** Updates a store that implements the {@link LocationStateStore} interface when a route changes, and vice versa. */
const useLocationStateHandler = <TState,>(
	stateValidator: (state: any) => state is TState,
	stateSetter: (state: TState) => void,
	onStateChange: ((event: StateChangeEvent<TState>) => void) | undefined,
	stateGetter: () => TState,
): void => {
	const deserializer = useLocationStateDeserializer();
	const serializer = useLocationStateSerializer();
	useStateHandler(
		deserializer,
		stateValidator,
		stateSetter,
		onStateChange,
		stateGetter,
		serializer,
	);
};

const useLocationStateSetter = <TState,>(
	store: IReactiveStateStore<TState>,
): ((state: TState) => void) => {
	return useCallback(
		(state: TState): void => {
			store.state = state;
		},
		[store],
	);
};

const useLocationStateGetter = <TState,>(
	store: IReactiveStateStore<TState>,
): (() => TState) => {
	return useCallback((): TState => store.state, [store]);
};

/** Updates a store that implements the {@link LocationStateStore} interface when a route changes, and vice versa. */
export const useLocationState = <TState,>(
	store: IReactiveStateStore<TState>,
): void => {
	const stateSetter = useLocationStateSetter(store);
	const stateGetter = useLocationStateGetter(store);
	useLocationStateHandler(
		store.validateState,
		stateSetter,
		store.onStateChange,
		stateGetter,
	);
};
