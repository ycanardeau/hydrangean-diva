import { Navigate, createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';

const RouteComponent = (): ReactElement => {
	return <Navigate to="/play-queue" />;
};

export const Route = createFileRoute('/_authenticated/')({
	component: RouteComponent,
});
