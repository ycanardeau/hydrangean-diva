import type { StateChangeEvent } from '@/stores/StateChangeEvent';
import { isEqual, omitBy } from 'lodash-es';
import { reaction } from 'mobx';
import { type MutableRefObject, useEffect, useRef } from 'react';

const useRestoreState = <TState,>(
	popStateRef: MutableRefObject<boolean>,
	deserializer: () => unknown,
	validator: (state: unknown) => state is TState,
	setter: (state: TState) => void,
): void => {
	useEffect(() => {
		const state = deserializer();

		if (validator(state)) {
			popStateRef.current = true;

			setter(state);

			popStateRef.current = false;
		}
	}, [deserializer, validator, popStateRef, setter]);
};

const useHandleStateChange = <TState extends Partial<TState>>(
	popStateRef: MutableRefObject<boolean>,
	onStateChange: ((event: StateChangeEvent<TState>) => void) | undefined,
	getter: () => TState,
): void => {
	useEffect(() => {
		if (!onStateChange) return;

		// Returns the disposer.
		return reaction(getter, (state, previousState) => {
			// Compare the current and previous values.
			const diff = omitBy(state, (v, k) =>
				isEqual(previousState[k as keyof typeof previousState], v),
			);

			// Assuming that the current value is `{ filter: 'Miku', page: 3939, searchType: 'Artist' }`, and the previous one is `{ filter: 'Miku', page: 1 }`,
			// then the diff will be `{ page: 3939, searchType: 'Artist' }`, which results in `['page', 'searchType']`.
			const keys = Object.keys(diff) as (keyof TState)[];
			console.assert(keys.length > 0);

			onStateChange({ keys: keys, popState: popStateRef.current });
		});
	}, [getter, onStateChange, popStateRef]);

	// This is called when the page is first loaded.
	useEffect(() => {
		if (!onStateChange) return;

		const keys = Object.keys(getter()) as (keyof TState)[];

		onStateChange({ keys: keys, popState: true /* Always true. */ });
	}, [getter, onStateChange]);
};

const useSaveState = <TState,>(
	popStateRef: MutableRefObject<boolean>,
	getter: () => TState,
	serializer: (state: TState) => void,
): void => {
	useEffect(() => {
		// Returns the disposer.
		return reaction(getter, (state) => {
			if (popStateRef.current) return;

			serializer(state);
		});
	}, [getter, popStateRef, serializer]);
};

export const useStateHandler = <TState,>(
	deserializer: () => unknown,
	validator: (state: unknown) => state is TState,
	setter: (state: TState) => void,
	onStateChange: ((event: StateChangeEvent<TState>) => void) | undefined,
	getter: () => TState,
	serializer: (state: TState) => void,
): void => {
	// Whether currently processing popstate. This is to prevent adding the previous state to history.
	const popStateRef = useRef(false);

	useRestoreState(popStateRef, deserializer, validator, setter);

	// This must be called before `useSaveState`, so that state can be changed in the `onStateChange` callback.
	useHandleStateChange(popStateRef, onStateChange, getter);

	useSaveState(popStateRef, getter, serializer);
};
