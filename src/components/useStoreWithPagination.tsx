import { StoreWithPagination } from '../stores/StoreWithPagination';
import { useStoreWithUpdateResults } from './useStoreWithUpdateResults';

export const useStoreWithPagination = <TRouteParams,>(
	store: StoreWithPagination<TRouteParams>,
): void => {
	useStoreWithUpdateResults(store);
};
