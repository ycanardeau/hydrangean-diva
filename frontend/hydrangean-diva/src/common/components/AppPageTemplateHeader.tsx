import { EuiPageHeaderProps, EuiPageTemplate, EuiTabProps } from '@elastic/eui';
import { EuiBreadcrumbProps } from '@elastic/eui/src/components/breadcrumbs/types';
import {
	AnyRouter,
	LinkProps,
	RegisteredRouter,
	useRouter,
} from '@tanstack/react-router';
import { ReactElement, ReactNode } from 'react';

export const AppPageTemplateHeader = <
	TComp = 'a',
	TRouter extends AnyRouter = RegisteredRouter,
	TFrom extends string = string,
	TTo extends string | undefined = '.',
	TMaskFrom extends string = TFrom,
	TMaskTo extends string = '.',
>({
	breadcrumbs,
	tabs,
	...props
}: Omit<EuiPageHeaderProps, 'breadcrumbs' | 'tabs'> & {
	breadcrumbs?: (Omit<EuiBreadcrumbProps, 'href'> & {
		linkProps?: LinkProps<TComp, TRouter, TFrom, TTo, TMaskFrom, TMaskTo>;
	})[];
} & {
	tabs?: (Omit<
		EuiTabProps & {
			/**
			 * Visible text of the tab
			 */
			label: ReactNode;
		},
		'href'
	> & {
		linkProps?: LinkProps<TComp, TRouter, TFrom, TTo, TMaskFrom, TMaskTo>;
	})[];
}): ReactElement => {
	const router = useRouter();

	return (
		<EuiPageTemplate.Header
			{...props}
			breadcrumbs={breadcrumbs?.map(({ linkProps, ...breadcrumb }) => ({
				...breadcrumb,
				href:
					linkProps === undefined
						? undefined
						: router.buildLocation(linkProps as any /* FIXME */)
								.href,
				onClick:
					linkProps === undefined
						? undefined
						: async (e): Promise<void> => {
								e.preventDefault();

								await router.navigate(linkProps);
							},
			}))}
			tabs={tabs?.map(({ linkProps, ...tab }) => ({
				...tab,
				href:
					linkProps === undefined
						? undefined
						: router.buildLocation(linkProps as any /* FIXME */)
								.href,
				onClick:
					linkProps === undefined
						? undefined
						: async (e: any /* FIXME */): Promise<void> => {
								e.preventDefault();

								await router.navigate(linkProps);
							},
			}))}
		/>
	);
};
