import { StoreWithRouteParams } from './StoreWithRouteParams';

export interface RouteParamsChangeEvent<TRouteParams> {
	keys: (keyof TRouteParams)[];
	popState: boolean;
	intersects: (keys: (keyof TRouteParams)[]) => boolean;
}

export interface StoreWithUpdateResults<TRouteParams>
	extends StoreWithRouteParams<TRouteParams> {
	onRouteParamsChange(event: RouteParamsChangeEvent<TRouteParams>): void;
}
