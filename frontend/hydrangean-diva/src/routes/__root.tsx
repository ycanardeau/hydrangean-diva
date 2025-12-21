import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactElement } from 'react';

const RootComponent = (): ReactElement => {
	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
};

export const Route = createRootRoute({
	component: RootComponent,
});
