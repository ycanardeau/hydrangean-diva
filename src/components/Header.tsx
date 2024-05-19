import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { findVideoService } from '@aigamo/nostalgic-diva';
import {
	EuiButton,
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
import { AddRegular } from '@fluentui/react-icons';
import React from 'react';

import { AddVideoModal } from './AddVideoModal';

interface NoembedResult {
	title: string;
}

function isNoembedResult(value: any): value is NoembedResult {
	return (
		value !== null &&
		typeof value === 'object' &&
		'title' in value &&
		typeof value.title === 'string'
	);
}

interface AddVideoButtonProps {
	playQueueStore: PlayQueueStore;
}

export const AddVideoButton = React.memo(
	({ playQueueStore }: AddVideoButtonProps): React.ReactElement => {
		const [addVideoModalOpen, setAddVideoModalOpen] = React.useState(false);

		const handleSave = React.useCallback(
			async (e): Promise<void> => {
				const videoService = findVideoService(e.url);
				if (videoService !== undefined) {
					const videoId = videoService.extractVideoId(e.url);
					if (videoId !== undefined) {
						const response = await fetch(
							`https://noembed.com/embed?url=${encodeURIComponent(
								e.url,
							)}`,
						);
						const jsonData = await response.json();

						playQueueStore.addItems([
							playQueueStore.createItem({
								url: e.url,
								type: videoService.type,
								videoId: videoId,
								title:
									e.title ||
									(isNoembedResult(jsonData)
										? jsonData.title
										: videoId),
							}),
						]);
					}
				}

				setAddVideoModalOpen(false);
			},
			[playQueueStore],
		);

		return (
			<>
				<EuiButton
					onClick={(): void => setAddVideoModalOpen(true)}
					iconType={AddRegular}
					size="s"
					color="primary"
				>
					Add video{/* LOC */}
				</EuiButton>

				{addVideoModalOpen && (
					<AddVideoModal
						onCancel={(): void => setAddVideoModalOpen(false)}
						onSave={handleSave}
					/>
				)}
			</>
		);
	},
);

interface HeaderProps {
	playQueueStore: PlayQueueStore;
}

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

	const leftSectionItems: React.ReactNode[] = [collapsibleNav];

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
							<AddVideoButton playQueueStore={playQueueStore} />
						</EuiHeaderLinks>,
					],
				},
			]}
		/>
	);
};
