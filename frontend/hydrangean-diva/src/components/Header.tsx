import { PlayQueueStore } from '@/stores/PlayQueueStore';
import {
	EuiBadge,
	EuiCollapsibleNav,
	EuiCollapsibleNavGroup,
	EuiFlexItem,
	EuiHeader,
	EuiHeaderLinks,
	EuiHeaderSectionItemButton,
	EuiIcon,
	EuiListGroup,
	EuiListGroupItemProps,
	EuiToolTip,
	useGeneratedHtmlId,
} from '@elastic/eui';
import React from 'react';

interface HeaderProps {
	playQueueStore: PlayQueueStore;
}

const commitHash =
	typeof import.meta.env.VITE_COMMIT_HASH === 'string'
		? import.meta.env.VITE_COMMIT_HASH
		: undefined;

export const Header = ({ playQueueStore }: HeaderProps): React.ReactElement => {
	const [navIsOpen, setNavIsOpen] = React.useState(false);

	const collapsibleNavId = useGeneratedHtmlId({ prefix: 'collapsibleNav' });

	const listItems: EuiListGroupItemProps[] = React.useMemo(() => [], []);

	const collapsibleNav = (
		<EuiCollapsibleNav
			id={collapsibleNavId}
			isOpen={navIsOpen}
			button={
				<EuiHeaderSectionItemButton
					onClick={(): void => setNavIsOpen(!navIsOpen)}
				>
					<EuiIcon type="menu" size="m" aria-hidden="true" />
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

	const leftSectionItems: React.ReactNode[] = [
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
