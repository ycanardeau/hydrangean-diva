import type { IStateStore } from '@/stores/IStateStore';
import type { StateChangeEvent } from '@/stores/StateChangeEvent';
import { useCallback } from 'react';

import { useStateHandler } from './useStateHandler';

const useLocalStorageStateDeserializer = (key: string): (() => unknown) => {
	return useCallback((): unknown => {
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
	validator: (state: unknown) => state is TState,
	setter: (state: TState) => void,
	onStateChange: ((event: StateChangeEvent<TState>) => void) | undefined,
	getter: () => TState,
): void => {
	const deserializer = useLocalStorageStateDeserializer(key);
	const serializer = useLocalStorageStateSerializer(key);
	useStateHandler(
		deserializer,
		validator,
		setter,
		onStateChange,
		getter,
		serializer,
	);
};

const useLocalStorageStateSetter = <TState,>(
	store: IStateStore<TState>,
): ((state: TState) => void) => {
	return useCallback(
		(state: TState): void => {
			store.state = state;
		},
		[store],
	);
};

const useLocalStorageStateGetter = <TState,>(
	store: IStateStore<TState>,
): (() => TState) => {
	return useCallback((): TState => store.state, [store]);
};

export const useLocalStorageState = <TState,>(
	key: string,
	store: IStateStore<TState>,
): void => {
	const setter = useLocalStorageStateSetter(store);
	const getter = useLocalStorageStateGetter(store);
	useLocalStorageStateHandler(
		key,
		store.validateState,
		setter,
		store.onStateChange,
		getter,
	);
};
