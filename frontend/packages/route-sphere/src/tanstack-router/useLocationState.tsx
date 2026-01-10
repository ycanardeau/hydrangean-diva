import { useStateHandler } from '@/components/useStateHandler';
import type { IStateStore } from '@/stores/IStateStore';
import type { StateChangeEvent } from '@/stores/StateChangeEvent';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { type ParsedQs, parse } from 'qs';
import { useCallback } from 'react';

const useLocationStateDeserializer = (): (() => ParsedQs) => {
	const location = useLocation();

	// Pass `location` as deps instead of `location.search`.
	return useCallback(
		(): ParsedQs => parse(location.searchStr.slice(1)),
		[location],
	);
};

const useLocationStateSerializer = <TState,>(): ((state: TState) => void) => {
	const navigate = useNavigate();

	return useCallback(
		async (state: TState): Promise<void> => {
			await navigate({ search: state as any /* FIXME */ });
		},
		[navigate],
	);
};

/** Updates a store that implements the {@link LocationStateStore} interface when a route changes, and vice versa. */
const useLocationStateHandler = <TState,>(
	validator: (state: unknown) => state is TState,
	setter: (state: TState) => void,
	onStateChange: ((event: StateChangeEvent<TState>) => void) | undefined,
	getter: () => TState,
): void => {
	const deserializer = useLocationStateDeserializer();
	const serializer = useLocationStateSerializer();
	useStateHandler(
		deserializer,
		validator,
		setter,
		onStateChange,
		getter,
		serializer,
	);
};

const useLocationStateSetter = <TState,>(
	store: IStateStore<TState>,
): ((state: TState) => void) => {
	return useCallback(
		(state: TState) => {
			store.state = state;
		},
		[store],
	);
};

const useLocationStateGetter = <TState,>(
	store: IStateStore<TState>,
): (() => TState) => {
	return useCallback(() => store.state, [store]);
};

/** Updates a store that implements the {@link LocationStateStore} interface when a route changes, and vice versa. */
export const useLocationState = <TState,>(store: IStateStore<TState>): void => {
	const setter = useLocationStateSetter(store);
	const getter = useLocationStateGetter(store);
	useLocationStateHandler(
		store.validateState,
		setter,
		store.onStateChange,
		getter,
	);
};
