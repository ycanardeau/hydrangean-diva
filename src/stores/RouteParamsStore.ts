export const includesAny = <T>(array: T[], values: T[]): boolean => {
	return values.some((value) => array.includes(value));
};

export interface RouteParamsChangeEvent<TRouteParams> {
	keys: (keyof TRouteParams)[];
	popState: boolean;
}

export interface RouteParamsStore<TRouteParams> {
	routeParams: TRouteParams;
	validateRouteParams(data: any): data is TRouteParams;
	onRouteParamsChange?(event: RouteParamsChangeEvent<TRouteParams>): void;
}
