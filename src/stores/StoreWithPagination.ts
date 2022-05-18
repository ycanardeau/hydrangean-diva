import { StoreWithUpdateResults } from './StoreWithUpdateResults';

export interface StoreWithPagination<TRouteParams>
	extends StoreWithUpdateResults<TRouteParams> {
	/** Called when search results should be cleared. */
	onClearResults(): void;
}
