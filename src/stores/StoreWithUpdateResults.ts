import { StoreWithRouteParams } from './StoreWithRouteParams';

export interface StoreWithUpdateResults<TRouteParams>
	extends StoreWithRouteParams<TRouteParams> {
	readonly clearResultsByQueryKeys: (keyof TRouteParams)[];
	/** Called when search results should be cleared. */
	onClearResults?(): void;
	updateResults(clearResults: boolean): Promise<void>;
}
