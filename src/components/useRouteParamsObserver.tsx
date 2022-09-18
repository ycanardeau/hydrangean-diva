import _ from 'lodash';
import { PartialObject } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';

import { RouteParamsStore } from '../stores/RouteParamsStore';

export const useRouteParamsObserver = <
	TRouteParams extends PartialObject<TRouteParams>,
>(
	store: RouteParamsStore<TRouteParams>,
	onRouteParamsChange?: (keys: (keyof TRouteParams)[]) => void,
): void => {
	React.useEffect(() => {
		// Returns the disposer.
		return reaction(
			() => store.routeParams,
			(routeParams, previousRouteParams) => {
				if (!onRouteParamsChange) return;

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
				const keys = Object.keys(diff) as (keyof TRouteParams)[];
				console.assert(keys.length > 0);

				onRouteParamsChange(keys);
			},
		);
	}, [store, onRouteParamsChange]);

	// This is called when the page is first loaded.
	React.useEffect(() => {
		if (!onRouteParamsChange) return;

		const keys = Object.keys(store.routeParams) as (keyof TRouteParams)[];

		onRouteParamsChange(keys);
	}, [store, onRouteParamsChange]);
};
