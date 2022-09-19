import React from 'react';

import { LocalStorageStateStore } from '../stores/LocalStorageStateStore';
import { useLocalStorageStateHandler } from './useLocalStorageStateHandler';

export const useLocalStorageStateSetter = <TState,>(
	store: LocalStorageStateStore<TState>,
): ((state: TState) => void) => {
	return React.useCallback(
		(state: TState) => {
			store.localStorageState = state;
		},
		[store],
	);
};

export const useLocalStorageStateGetter = <TState,>(
	store: LocalStorageStateStore<TState>,
): (() => TState) => {
	return React.useCallback(() => store.localStorageState, [store]);
};

export const useLocalStorageStateStore = <TState,>(
	key: string,
	store: LocalStorageStateStore<TState>,
): void => {
	const stateSetter = useLocalStorageStateSetter(store);
	const stateGetter = useLocalStorageStateGetter(store);
	useLocalStorageStateHandler(
		key,
		store.validateLocalStorageState,
		stateSetter,
		store.onLocalStorageStateChange,
		stateGetter,
	);
};
