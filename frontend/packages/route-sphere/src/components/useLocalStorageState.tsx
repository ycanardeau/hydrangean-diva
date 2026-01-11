import type { IStateStore } from '@/stores/IStateStore';
import type { StateChangeEvent } from '@/stores/StateChangeEvent';
import { useCallback, useMemo } from 'react';

import type { IStateAccessor } from './IStateAccessor';
import type { IStateCodec } from './IStateCodec';
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

const useLocalStorageStateCodec = <TState,>(
	key: string,
): IStateCodec<TState> => {
	const deserializer = useLocalStorageStateDeserializer(key);
	const serializer = useLocalStorageStateSerializer(key);
	const codec = useMemo(
		(): IStateCodec<TState> => ({
			deserialize: deserializer,
			serialize: serializer,
		}),
		[deserializer, serializer],
	);
	return codec;
};

const useLocalStorageStateHandler = <TState,>(
	key: string,
	validator: (state: unknown) => state is TState,
	accessor: IStateAccessor<TState>,
	onStateChange: ((event: StateChangeEvent<TState>) => void) | undefined,
): void => {
	const codec = useLocalStorageStateCodec(key);
	useStateHandler(codec, validator, accessor, onStateChange);
};

const useLocalStorageStateGetter = <TState,>(
	store: IStateStore<TState>,
): (() => TState) => {
	return useCallback((): TState => store.state, [store]);
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

const useLocalStorageStateAccessor = <TState,>(
	store: IStateStore<TState>,
): IStateAccessor<TState> => {
	const getter = useLocalStorageStateGetter(store);
	const setter = useLocalStorageStateSetter(store);
	const accessor = useMemo(
		(): IStateAccessor<TState> => ({ get: getter, set: setter }),
		[getter, setter],
	);
	return accessor;
};

export const useLocalStorageState = <TState,>(
	key: string,
	store: IStateStore<TState>,
): void => {
	const accessor = useLocalStorageStateAccessor(store);
	useLocalStorageStateHandler(
		key,
		store.validateState,
		accessor,
		store.onStateChange,
	);
};
