import { createFileRoute, Navigate } from '@tanstack/react-router';
import { ReactElement } from 'react';

const RouteComponent = (): ReactElement => {
	return <Navigate to="/play-queue" />;
};

export const Route = createFileRoute('/_authenticated/')({
	component: RouteComponent,
});
