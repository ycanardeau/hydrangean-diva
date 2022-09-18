import { reaction } from 'mobx';
import React from 'react';

import { RouteParamsStore } from '../stores/RouteParamsStore';

export const useRouteParamsDeserializer = <TRouteParams,>(
	store: RouteParamsStore<TRouteParams>,
	deserializer: () => any,
): void => {
	React.useEffect(() => {
		const routeParams = deserializer();

		if (store.validateRouteParams(routeParams)) {
			store.routeParams = routeParams;
		}
	}, [store, deserializer]);
};

export const useRouteParamsSerializer = <TRouteParams,>(
	store: RouteParamsStore<TRouteParams>,
	serializer: (routeParams: TRouteParams) => void,
): void => {
	React.useEffect(() => {
		// Returns the disposer.
		return reaction(
			() => store.routeParams,
			(routeParams) => {
				serializer(routeParams);
			},
		);
	}, [store, serializer]);
};
