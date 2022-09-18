import { StoreWithRouteParams } from './StoreWithRouteParams';

export interface RouteParamsChangeEvent<TRouteParams> {
	keys: (keyof TRouteParams)[];
	popState: boolean;
}

export interface StoreWithUpdateResults<TRouteParams>
	extends StoreWithRouteParams<TRouteParams> {
	onRouteParamsChange(event: RouteParamsChangeEvent<TRouteParams>): void;
}

export type StoreWithPagination<TRouteParams> =
	StoreWithUpdateResults<TRouteParams>;
