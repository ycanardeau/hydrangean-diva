import { isEqual, omitBy } from 'lodash-es';
import { reaction } from 'mobx';
import { type MutableRefObject, useEffect, useRef } from 'react';

import type {
	IStateAccessor,
	IStateGetter,
	IStateSetter,
} from './IStateAccessor';
import type {
	IStateCodec,
	IStateDeserializer,
	IStateSerializer,
} from './IStateCodec';
import type {
	IHandleStateChangeOptions,
	IRestoreStateOptions,
	IStateHandlerOptions,
} from './IStateHandlerOptions';

const useRestoreState = <TState,>(
	popStateRef: MutableRefObject<boolean>,
	deserializer: IStateDeserializer /*<TState>*/,
	validator: (state: unknown) => state is TState,
	setter: IStateSetter<TState>,
	options: IRestoreStateOptions<TState>,
): void => {
	useEffect(() => {
		const state = deserializer.deserialize();

		if (validator(state)) {
			options.onStateValidate?.({ state: state });

			popStateRef.current = true;

			setter.set(state);

			popStateRef.current = false;

			options.onStateRestore?.({ state: state });
		}
	}, [deserializer, validator, popStateRef, setter, options]);
};

const useHandleStateChange = <TState extends Partial<TState>>(
	popStateRef: MutableRefObject<boolean>,
	getter: IStateGetter<TState>,
	options: IHandleStateChangeOptions<TState>,
): void => {
	useEffect(() => {
		// Returns the disposer.
		return reaction(getter.get, (state, previousState) => {
			if (!options.onStateChange) return;

			// Compare the current and previous values.
			const diff = omitBy(state, (v, k) =>
				isEqual(previousState[k as keyof typeof previousState], v),
			);

			// Assuming that the current value is `{ filter: 'Miku', page: 3939, searchType: 'Artist' }`, and the previous one is `{ filter: 'Miku', page: 1 }`,
			// then the diff will be `{ page: 3939, searchType: 'Artist' }`, which results in `['page', 'searchType']`.
			const keys = Object.keys(diff) as (keyof TState)[];
			console.assert(keys.length > 0);

			options.onStateChange({
				state: state,
				previousState: previousState,
				keys: keys,
				popState: popStateRef.current,
			});
		});
	}, [getter, popStateRef, options]);

	// This is called when the page is first loaded.
	useEffect(() => {
		if (!options.onStateChange) return;

		const state = getter.get();
		const previousState = {} as TState;

		const keys = Object.keys(state) as (keyof TState)[];

		options.onStateChange({
			state: state,
			previousState: previousState,
			keys: keys,
			popState: true /* Always true. */,
		});
	}, [getter, options]);
};

const useSaveState = <TState,>(
	popStateRef: MutableRefObject<boolean>,
	getter: IStateGetter<TState>,
	serializer: IStateSerializer<TState>,
): void => {
	useEffect(() => {
		// Returns the disposer.
		return reaction(getter.get, (state) => {
			if (popStateRef.current) return;

			serializer.serialize(state);
		});
	}, [getter, popStateRef, serializer]);
};

export const useStateHandler = <TState,>(
	codec: IStateCodec<TState>,
	validator: (state: unknown) => state is TState,
	accessor: IStateAccessor<TState>,
	options: IStateHandlerOptions<TState>,
): void => {
	// Whether currently processing popstate. This is to prevent adding the previous state to history.
	const popStateRef = useRef(false);

	useRestoreState(popStateRef, codec, validator, accessor, options);

	// This must be called before `useSaveState`, so that state can be changed in the `onStateChange` callback.
	useHandleStateChange(popStateRef, accessor, options);

	useSaveState(popStateRef, accessor, codec);
};
