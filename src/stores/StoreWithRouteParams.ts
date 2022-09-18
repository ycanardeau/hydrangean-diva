export interface StoreWithRouteParams<TRouteParams> {
	routeParams: TRouteParams;
	validateRouteParams(data: any): data is TRouteParams;
}
