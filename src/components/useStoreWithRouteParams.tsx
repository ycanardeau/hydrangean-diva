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
	const deserializer = React.useCallback(
		() => qs.parse(location.search.slice(1)),
		[location],
	);

	React.useEffect(() => {
		const routeParams = deserializer();

		if (store.validateRouteParams(routeParams)) {
			store.routeParams = routeParams;
		}
	}, [store, deserializer]);
};

/** Updates a route when a store that implements the {@link StoreWithRouteParams} interface changes. */
export const useRouteParamsToLocation = <TRouteParams,>(
	store: StoreWithRouteParams<TRouteParams>,
): void => {
	const navigate = useNavigate();

	const serializer = React.useCallback(
		(routeParams: TRouteParams) => {
			const newUrl = `?${qs.stringify(routeParams)}`;
			navigate(newUrl);
		},
		[navigate],
	);

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

	React.useEffect(() => {
		// Returns the disposer.
		return reaction(
			() => store.routeParams,
			(routeParams) => {
				if (!popStateRef.current) serializer(routeParams);
			},
		);
	}, [store, serializer]);

	React.useEffect(() => {
		popStateRef.current = false;
	});
};

/** Updates a store that implements the {@link StoreWithRouteParams} interface when a route changes, and vice versa. */
export const useStoreWithRouteParams = <TRouteParams,>(
	store: StoreWithRouteParams<TRouteParams>,
): void => {
	useLocationToRouteParams(store);
	useRouteParamsToLocation(store);
};
