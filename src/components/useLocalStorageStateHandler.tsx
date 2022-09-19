import React from 'react';

import { StateChangeEvent } from '../stores/StateChangeEvent';
import { useStateHandler } from './useStateHandler';

export const useLocalStorageStateDeserializer = (key: string): (() => any) => {
	return React.useCallback(() => {
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

export const useLocalStorageStateSerializer = <TState,>(
	key: string,
): ((state: TState) => void) => {
	return React.useCallback(
		(state: TState) => {
			window.localStorage.setItem(key, JSON.stringify(state));
		},
		[key],
	);
};

export const useLocalStorageStateHandler = <TState,>(
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
