import _, { PartialObject } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';

import { StoreWithUpdateResults } from '../stores/StoreWithUpdateResults';
import { useStoreWithRouteParams } from './useStoreWithRouteParams';

/** Updates search results whenever the {@link StoreWithUpdateResults.routeParams} property changes. */
export const useStoreWithUpdateResults = <
	TRouteParams extends PartialObject<TRouteParams>,
>(
	store: StoreWithUpdateResults<TRouteParams>,
): void => {
	// Whether currently processing popstate. This is to prevent adding the previous state to history.
	const popStateRef = React.useRef(false);

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
				// Determines if search results should be cleared by comparing the current and previous values.
				// Assuming that the current value is `{ filter: 'Miku', page: 3939, searchType: 'Artist' }`, and the previous one is `{ filter: 'Miku', page: 1 }`,
				// then the diff will be `{ page: 3939, searchType: 'Artist' }`, which results in `['page', 'searchType']`.
				const clearResults = _.chain(routeParams)
					.omitBy((v, k) =>
						_.isEqual(
							previousRouteParams[
								k as keyof typeof previousRouteParams
							],
							v,
						),
					)
					.keys()
					.some((k) =>
						store.clearResultsByQueryKeys.includes(
							k as keyof TRouteParams,
						),
					)
					.value();

				if (clearResults) {
					// Do not clear results when the back/forward buttons are clicked.
					if (!popStateRef.current) store.onClearResults?.();
				}

				store.updateResults(clearResults);
			},
		);
	}, [store]);

	useStoreWithRouteParams(store);

	React.useEffect(() => {
		// This is called when the page is first loaded.
		store.updateResults(true);
	}, [store]);

	React.useEffect(() => {
		popStateRef.current = false;
	});
};
