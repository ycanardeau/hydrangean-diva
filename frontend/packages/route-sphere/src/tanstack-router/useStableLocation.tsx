// https://github.com/TanStack/router/issues/3110#issuecomment-3958146041
import { useRouterState } from '@tanstack/react-router';
import { useMemo } from 'react';

export const useStableLocation = (): { location: string } => {
	const { isLoading, resolvedLocation, location } = useRouterState({
		select: (state) => ({
			isLoading: state.isLoading,
			resolvedLocation: state.resolvedLocation?.pathname,
			location: state.location.pathname,
		}),
	});

	return useMemo(() => {
		const currentLocation = isLoading
			? (resolvedLocation ?? location)
			: location;

		return {
			location: currentLocation,
		};
	}, [isLoading, resolvedLocation, location]);
};
