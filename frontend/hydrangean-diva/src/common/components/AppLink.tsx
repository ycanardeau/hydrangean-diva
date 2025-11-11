import { EuiLink, EuiLinkAnchorProps } from '@elastic/eui';
import {
	AnyRouter,
	LinkProps,
	RegisteredRouter,
	useRouter,
} from '@tanstack/react-router';
import { ReactElement } from 'react';

export const AppLink = <
	TComp = 'a',
	TRouter extends AnyRouter = RegisteredRouter,
	TFrom extends string = string,
	TTo extends string | undefined = '.',
	TMaskFrom extends string = TFrom,
	TMaskTo extends string = '.',
>({
	linkProps,
	...props
}: Omit<EuiLinkAnchorProps, 'href'> & {
	linkProps: LinkProps<TComp, TRouter, TFrom, TTo, TMaskFrom, TMaskTo>;
}): ReactElement => {
	const router = useRouter();

	const handleClick = async (e: React.MouseEvent): Promise<void> => {
		e.preventDefault();

		await router.navigate(linkProps);
	};

	return (
		<EuiLink
			{...props}
			href={router.buildLocation(linkProps as any /* FIXME */).href}
			onClick={handleClick}
		/>
	);
};
