import { StoreWithRouteParams } from './StoreWithRouteParams';

export const includesAny = <T>(array: T[], values: T[]): boolean => {
	return values.some((value) => array.includes(value));
};

export interface RouteParamsChangeEvent<TRouteParams> {
	keys: (keyof TRouteParams)[];
	popState: boolean;
}

export interface StoreWithUpdateResults<TRouteParams>
	extends StoreWithRouteParams<TRouteParams> {
	onRouteParamsChange(event: RouteParamsChangeEvent<TRouteParams>): void;
}
