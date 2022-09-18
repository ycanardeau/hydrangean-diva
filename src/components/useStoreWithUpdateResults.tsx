import _, { PartialObject } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';

import {
	StoreWithPagination,
	StoreWithUpdateResults,
} from '../stores/StoreWithUpdateResults';
import { useStoreWithRouteParams } from './useStoreWithRouteParams';

/** Updates search results whenever the {@link StoreWithUpdateResults.routeParams} property changes. */
export const useStoreWithUpdateResults = <
	TRouteParams extends PartialObject<TRouteParams>,
>(
	store: StoreWithUpdateResults<TRouteParams>,
): void => {
	// Whether currently processing popstate. This is to prevent adding the previous state to history.
	const popStateRef = React.useRef(true);

	React.useLayoutEffect(() => {
		const popStateHandler = (): void => {
			popStateRef.current = true;
		};

		window.addEventListener('popstate', popStateHandler);

		return (): void => {
			window.removeEventListener('popstate', popStateHandler);
		};
	}, []);

	// This must be called before `useStoreWithRouteParams` because this may change `routeParams` based on `clearResultsByQueryKeys`.
	React.useEffect(() => {
		// Returns the disposer.
		return reaction(
			() => store.routeParams,
			(routeParams, previousRouteParams) => {
				// Compare the current and previous values.
				const diff = _.chain(routeParams)
					.omitBy((v, k) =>
						_.isEqual(
							previousRouteParams[
								k as keyof typeof previousRouteParams
							],
							v,
						),
					)
					.value();

				// Assuming that the current value is `{ filter: 'Miku', page: 3939, searchType: 'Artist' }`, and the previous one is `{ filter: 'Miku', page: 1 }`,
				// then the diff will be `{ page: 3939, searchType: 'Artist' }`, which results in `['page', 'searchType']`.
				const diffKeys = Object.keys(diff) as (keyof TRouteParams)[];
				console.assert(diffKeys.length > 0);

				const popState = popStateRef.current;

				const event = {
					keys: diffKeys,
					popState: popState,
				};

				store.onRouteParamsChange(event);
			},
		);
	}, [store]);

	useStoreWithRouteParams(store);

	React.useEffect(() => {
		const diffKeys = Object.keys(
			store.routeParams,
		) as (keyof TRouteParams)[];

		const popState = popStateRef.current;

		const event = {
			keys: diffKeys,
			popState: popState,
		};

		// This is called when the page is first loaded.
		store.onRouteParamsChange(event);
	}, [store]);

	React.useEffect(() => {
		popStateRef.current = false;
	});
};

export const useStoreWithPagination = <TRouteParams,>(
	store: StoreWithPagination<TRouteParams>,
): void => {
	useStoreWithUpdateResults(store);
};
