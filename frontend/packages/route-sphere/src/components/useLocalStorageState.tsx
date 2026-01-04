import type { IReactiveStateStore } from '@/stores/IReactiveStateStore';
import type { StateChangeEvent } from '@/stores/StateChangeEvent';
import { useCallback } from 'react';

import { useStateHandler } from './useStateHandler';

const useLocalStorageStateDeserializer = (key: string): (() => any) => {
	return useCallback((): any => {
		try {
			return JSON.parse(
				window.localStorage.getItem(key) ?? JSON.stringify({}),
			);
		} catch (error) {
			console.error(error);
			return {};
		}
	}, [key]);
};

const useLocalStorageStateSerializer = <TState,>(
	key: string,
): ((state: TState) => void) => {
	return useCallback(
		(state: TState): void => {
			window.localStorage.setItem(key, JSON.stringify(state));
		},
		[key],
	);
};

const useLocalStorageStateHandler = <TState,>(
	key: string,
	stateValidator: (state: any) => state is TState,
	stateSetter: (state: TState) => void,
	onStateChange: ((event: StateChangeEvent<TState>) => void) | undefined,
	stateGetter: () => TState,
): void => {
	const deserializer = useLocalStorageStateDeserializer(key);
	const serializer = useLocalStorageStateSerializer(key);
	useStateHandler(
		deserializer,
		stateValidator,
		stateSetter,
		onStateChange,
		stateGetter,
		serializer,
	);
};

const useLocalStorageStateSetter = <TState,>(
	store: IReactiveStateStore<TState>,
): ((state: TState) => void) => {
	return useCallback(
		(state: TState): void => {
			store.state = state;
		},
		[store],
	);
};

const useLocalStorageStateGetter = <TState,>(
	store: IReactiveStateStore<TState>,
): (() => TState) => {
	return useCallback((): TState => store.state, [store]);
};

export const useLocalStorageState = <TState,>(
	key: string,
	store: IReactiveStateStore<TState>,
): void => {
	const stateSetter = useLocalStorageStateSetter(store);
	const stateGetter = useLocalStorageStateGetter(store);
	useLocalStorageStateHandler(
		key,
		store.validateState,
		stateSetter,
		store.onStateChange,
		stateGetter,
	);
};
