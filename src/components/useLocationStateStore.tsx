import React from 'react';

import { LocationStateStore } from '../stores/LocationStateStore';
import { useLocationStateHandler } from './useLocationStateHandler';

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
