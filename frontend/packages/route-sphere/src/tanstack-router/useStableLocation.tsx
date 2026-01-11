import { useRouterState } from '@tanstack/react-router';
import { useMemo, useRef } from 'react';

// https://github.com/TanStack/router/issues/3110#issuecomment-3244947080
export const useStableLocation = (): string => {
	const { isLoading, pathname } = useRouterState({
		select: (state) => ({
			isLoading: state.isLoading,
			pathname: state.location.pathname,
		}),
	});
	const matchingLocation = useRef<string>(pathname);
	return useMemo((): string => {
		if (!isLoading && matchingLocation.current !== pathname) {
			matchingLocation.current = pathname;
		}
		return matchingLocation.current;
	}, [isLoading, pathname]);
};
