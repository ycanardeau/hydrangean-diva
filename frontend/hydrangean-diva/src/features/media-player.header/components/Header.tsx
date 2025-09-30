import { bottomBarHeight } from '@/features/common/helpers/bottomBarHeight';
import { featureFlags } from '@/features/common/helpers/featureFlags';
import {
	EuiBadge,
	EuiCollapsibleNav,
	EuiCollapsibleNavGroup,
	EuiFlexItem,
	EuiHeader,
	EuiHeaderLinks,
	EuiHeaderLogo,
	EuiHeaderSectionItemButton,
	EuiIcon,
	EuiListGroup,
	EuiListGroupItemProps,
	EuiToolTip,
	IconType,
	useGeneratedHtmlId,
} from '@elastic/eui';
import { Cd16Regular, NavigationPlayRegular } from '@fluentui/react-icons';
import {
	AnyRouter,
	LinkProps,
	RegisteredRouter,
	useMatchRoute,
	useRouter,
} from '@tanstack/react-router';
import { ReactElement, ReactNode, useCallback, useState } from 'react';

const commitHash =
	typeof import.meta.env.VITE_COMMIT_HASH === 'string'
		? import.meta.env.VITE_COMMIT_HASH
		: undefined;

export const Header = (): ReactElement => {
	const [navIsOpen, setNavIsOpen] = useState(false);

	const collapsibleNavId = useGeneratedHtmlId({ prefix: 'collapsibleNav' });

	const router = useRouter();
	const matchRoute = useMatchRoute();

	const createItem = useCallback(
		<
			TComp = 'a',
			TRouter extends AnyRouter = RegisteredRouter,
			TFrom extends string = string,
			TTo extends string | undefined = '.',
			TMaskFrom extends string = TFrom,
			TMaskTo extends string = '.',
		>({
			label,
			iconType,
			linkProps,
			isDisabled,
		}: {
			label: string;
			iconType: IconType;
			linkProps: LinkProps<
				TComp,
				TRouter,
				TFrom,
				TTo,
				TMaskFrom,
				TMaskTo
			>;
			isDisabled?: boolean;
		}): EuiListGroupItemProps => {
			return {
				label: label,
				iconType: iconType,
				href: router.buildLocation(linkProps as any /* FIXME */).href,
				onClick: async (e): Promise<void> => {
					e.preventDefault();

					setNavIsOpen(false);

					await router.navigate(linkProps);
				},
				isActive: !!matchRoute({
					...(linkProps as any) /* FIXME */,
					fuzzy: true,
				}),
				isDisabled: isDisabled,
			};
		},
		[router, matchRoute],
	);

	const listItems: EuiListGroupItemProps[] = [
		createItem({
			label: 'Play queue' /* LOC */,
			iconType: NavigationPlayRegular,
			linkProps: {
				to: '/play-queue',
			},
		}),
		createItem({
			label: 'Playlists' /* LOC */,
			iconType: Cd16Regular,
			linkProps: {
				to: '/playlists',
			},
			isDisabled: !featureFlags.mediaPlayer.enablePlaylists,
		}),
	];

	const collapsibleNav = (
		<EuiCollapsibleNav
			id={collapsibleNavId}
			isOpen={navIsOpen}
			isDocked={true}
			css={{
				insetBlockEnd: bottomBarHeight,
			}}
			button={
				<EuiHeaderSectionItemButton
					onClick={(): void => setNavIsOpen(!navIsOpen)}
				>
					<EuiIcon type="menu" aria-hidden="true" />
				</EuiHeaderSectionItemButton>
			}
			onClose={(): void => setNavIsOpen(false)}
		>
			<EuiFlexItem grow={false} style={{ flexShrink: 0 }}>
				<EuiCollapsibleNavGroup
					background="light"
					style={{ maxHeight: '40vh' }}
					className="eui-yScroll"
				>
					<EuiListGroup
						listItems={listItems}
						maxWidth="none"
						color="text"
						gutterSize="none"
						size="s"
					/>
				</EuiCollapsibleNavGroup>
			</EuiFlexItem>
		</EuiCollapsibleNav>
	);

	const leftSectionItems: ReactNode[] = [
		<EuiHeaderLogo
			iconType={
				process.env.NODE_ENV === 'production'
					? '/hydrangean-diva/favicon.ico'
					: '/favicon.ico'
			}
			href="/"
			onClick={(e): void => {
				e.preventDefault();
			}}
		/>,
		collapsibleNav,
		commitHash && (
			<EuiBadge
				href={`https://github.com/ycanardeau/hydrangean-diva/tree/${commitHash}`}
				target="_blank"
			>
				{commitHash.slice(0, 7)}
			</EuiBadge>
		),
	];

	return (
		<EuiHeader
			style={{
				paddingTop: 'env(safe-area-inset-top)',
				paddingLeft: 'calc(env(safe-area-inset-left) + 8px)',
				paddingRight: 'calc(env(safe-area-inset-right) + 8px)',
				height: 'var(--euiFixedHeadersOffset)',
			}}
			position="fixed"
			sections={[
				{ items: leftSectionItems },
				{
					items: [
						<EuiHeaderLinks
							popoverProps={{ repositionOnScroll: true }}
						>
							<EuiToolTip content="GitHub">
								<EuiHeaderSectionItemButton
									href="https://github.com/ycanardeau/hydrangean-diva"
									target="_blank"
								>
									<EuiIcon
										type="logoGithub"
										aria-hidden="true"
									/>
								</EuiHeaderSectionItemButton>
							</EuiToolTip>
						</EuiHeaderLinks>,
					],
				},
			]}
		/>
	);
};
