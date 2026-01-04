import type { LocationStateStore } from '@/stores/LocationStateStore';
import type { StateChangeEvent } from '@/stores/StateChangeEvent';
import { type ParsedQs, parse, stringify } from 'qs';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useStateHandler } from './useStateHandler';

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
	store: LocationStateStore<TState>,
): ((state: TState) => void) => {
	return useCallback(
		(state: TState): void => {
			store.locationState = state;
		},
		[store],
	);
};

const useLocationStateGetter = <TState,>(
	store: LocationStateStore<TState>,
): (() => TState) => {
	return useCallback((): TState => store.locationState, [store]);
};

/** Updates a store that implements the {@link LocationStateStore} interface when a route changes, and vice versa. */
export const useLocationStateStore = <TState,>(
	store: LocationStateStore<TState>,
): void => {
	const stateSetter = useLocationStateSetter(store);
	const stateGetter = useLocationStateGetter(store);
	useLocationStateHandler(
		store.validateLocationState,
		stateSetter,
		store.onLocationStateChange,
		stateGetter,
	);
};
