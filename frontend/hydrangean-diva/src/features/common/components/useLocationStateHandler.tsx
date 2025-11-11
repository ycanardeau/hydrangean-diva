import {
	LocationStateStore,
	StateChangeEvent,
	useStateHandler,
} from '@aigamo/route-sphere';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { parse, ParsedQs } from 'qs';
import React from 'react';

export const useLocationStateDeserializer = (): (() => ParsedQs) => {
	const location = useLocation();

	// Pass `location` as deps instead of `location.search`.
	return React.useCallback(
		() => parse(location.searchStr.slice(1)),
		[location],
	);
};

export const useLocationStateSerializer = <TState,>(): ((
	state: TState,
) => void) => {
	const navigate = useNavigate();

	return React.useCallback(
		async (state: TState) => {
			await navigate({ search: state as any /* FIXME */ });
		},
		[navigate],
	);
};

/** Updates a store that implements the {@link LocationStateStore} interface when a route changes, and vice versa. */
export const useLocationStateHandler = <TState,>(
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

export const useLocationStateSetter = <TState,>(
	store: LocationStateStore<TState>,
): ((state: TState) => void) => {
	return React.useCallback(
		(state: TState) => {
			store.locationState = state;
		},
		[store],
	);
};

export const useLocationStateGetter = <TState,>(
	store: LocationStateStore<TState>,
): (() => TState) => {
	return React.useCallback(() => store.locationState, [store]);
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
