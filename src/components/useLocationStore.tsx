import { PartialObject } from 'lodash';
import qs from 'qs';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RouteParamsStore } from '../stores/RouteParamsStore';
import { useRouteParamsObserver } from './useRouteParamsObserver';
import {
	useRouteParamsDeserializer,
	useRouteParamsSerializer,
} from './useRouteParamsSerializer';

/** Updates a store that implements the {@link RouteParamsStore} interface when a route changes. */
export const useLocationToRouteParams = <TRouteParams,>(
	store: RouteParamsStore<TRouteParams>,
): void => {
	const location = useLocation();

	// Pass `location` as deps instead of `location.search`.
	const deserializer = React.useCallback(
		() => qs.parse(location.search.slice(1)),
		[location],
	);

	useRouteParamsDeserializer(store, deserializer);
};

/** Updates a route when a store that implements the {@link RouteParamsStore} interface changes. */
export const useRouteParamsToLocation = <
	TRouteParams extends PartialObject<TRouteParams>,
>(
	store: RouteParamsStore<TRouteParams>,
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

	const handleRouteParamsChange = React.useCallback(
		(keys: (keyof TRouteParams)[]) => {
			store.onRouteParamsChange?.({
				keys: keys,
				popState: popStateRef.current,
			});
		},
		[store],
	);

	useRouteParamsObserver(store, handleRouteParamsChange);

	const navigate = useNavigate();

	const serializer = React.useCallback(
		(routeParams: TRouteParams) => {
			if (popStateRef.current) return;

			const newUrl = `?${qs.stringify(routeParams)}`;
			navigate(newUrl);
		},
		[navigate],
	);

	useRouteParamsSerializer(store, serializer);

	React.useEffect(() => {
		popStateRef.current = false;
	});
};

/** Updates a store that implements the {@link RouteParamsStore} interface when a route changes, and vice versa. */
export const useLocationStore = <TRouteParams,>(
	store: RouteParamsStore<TRouteParams>,
): void => {
	useLocationToRouteParams(store);
	useRouteParamsToLocation(store);
};
