import { reaction } from 'mobx';
import qs from 'qs';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { StoreWithRouteParams } from '../stores/StoreWithRouteParams';

/** Updates a store that implements the {@link StoreWithRouteParams} interface when a route changes. */
export const useLocationToRouteParams = <TRouteParams,>(
	store: StoreWithRouteParams<TRouteParams>,
): void => {
	const location = useLocation();

	// Pass `location` as deps instead of `location.search`.
	React.useEffect(() => {
		const routeParams: any = qs.parse(location.search.slice(1));

		if (store.validateRouteParams(routeParams)) {
			store.popState = true;

			store.routeParams = routeParams;

			store.popState = false;
		}
	}, [location, store]);
};

/** Updates a route when a store that implements the {@link StoreWithRouteParams} interface changes. */
export const useRouteParamsToLocation = <TRouteParams,>(
	store: StoreWithRouteParams<TRouteParams>,
): void => {
	const navigate = useNavigate();

	React.useEffect(() => {
		// Returns the disposer.
		return reaction(
			() => store.routeParams,
			(routeParams) => {
				if (!store.popState) {
					const newUrl = `?${qs.stringify(routeParams)}`;
					navigate(newUrl);
				}
			},
		);
	}, [store, navigate]);
};

/** Updates a store that implements the {@link StoreWithRouteParams} interface when a route changes, and vice versa. */
export const useStoreWithRouteParams = <TRouteParams,>(
	store: StoreWithRouteParams<TRouteParams>,
): void => {
	useLocationToRouteParams(store);
	useRouteParamsToLocation(store);
};
