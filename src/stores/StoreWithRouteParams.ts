export interface StoreWithRouteParams<TRouteParams> {
	/** Whether currently processing popstate. This is to prevent adding the previous state to history. */
	popState: boolean;
	routeParams: TRouteParams;
	validateRouteParams(data: any): data is TRouteParams;
}
