import { usePlaylistList } from '@/features/media-player.playlists.abstractions/contexts/PlaylistListContext';
import {
	EuiButton,
	EuiContextMenuItem,
	EuiContextMenuPanel,
	EuiHorizontalRule,
	EuiIcon,
	EuiPanel,
	EuiPopover,
	EuiSelectable,
	type EuiSelectableOption,
} from '@elastic/eui';
import { AddRegular, NavigationPlayRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { type ReactElement, useEffect, useState } from 'react';

interface AddToSelectableProps {
	closePopover: () => void;
}

const AddToSelectable = observer(
	({ closePopover }: AddToSelectableProps): ReactElement => {
		const playlistList = usePlaylistList();

		const [options, setOptions] = useState<
			EuiSelectableOption[] | 'loading'
		>('loading');

		useEffect(() => {
			void Promise.resolve({
				items: playlistList.items,
			}).then((response) =>
				setOptions(
					response.items.map((item) => ({
						key: item.id,
						label: item.name,
					})),
				),
			);
		}, [playlistList]);

		return (
			<EuiSelectable
				searchable
				searchProps={{
					compressed: true,
				}}
				options={options === 'loading' ? undefined : options}
				isLoading={options === 'loading'}
				onChange={async (
					_option,
					_event,
					changedOption,
				): Promise<void> => {
					closePopover();

					// TODO: await onAddToPlaylist(changedOption);
				}}
				singleSelection
			>
				{(list, search) => (
					<>
						{search}
						{list}
					</>
				)}
			</EuiSelectable>
		);
	},
);

interface AddToPlayQueueContextMenuItemProps {
	closePopover: () => void;
}

const AddToPlayQueueContextMenuItem = ({
	closePopover,
}: AddToPlayQueueContextMenuItemProps): ReactElement => {
	const handleClick = async (): Promise<void> => {
		closePopover();
	};

	return (
		<EuiContextMenuItem
			icon={<EuiIcon type={NavigationPlayRegular} />}
			size="s"
			onClick={handleClick}
		>
			Play queue
		</EuiContextMenuItem>
	);
};

interface AddToNewPlaylistContextMenuItemProps {
	closePopover: () => void;
}

const AddToNewPlaylistContextMenuItem = ({
	closePopover,
}: AddToNewPlaylistContextMenuItemProps): ReactElement => {
	const handleClick = async (): Promise<void> => {
		closePopover();
	};

	return (
		<EuiContextMenuItem
			icon={<EuiIcon type={AddRegular} />}
			size="s"
			onClick={handleClick}
		>
			New playlist
		</EuiContextMenuItem>
	);
};

interface AddToSelectablePopoverProps {
	disabled: boolean;
}

export const AddToSelectablePopover = ({
	disabled,
}: AddToSelectablePopoverProps): ReactElement => {
	const [isPopoverOpen, setPopoverOpen] = useState(false);

	const closePopover = (): void => setPopoverOpen(false);

	return (
		<EuiPopover
			panelPaddingSize="none"
			button={
				<EuiButton
					iconType={AddRegular}
					onClick={(): void => setPopoverOpen(!isPopoverOpen)}
					disabled={disabled}
				>
					Add to{/* LOC */}
				</EuiButton>
			}
			isOpen={isPopoverOpen}
			closePopover={closePopover}
		>
			<EuiContextMenuPanel>
				<AddToPlayQueueContextMenuItem closePopover={closePopover} />

				<EuiHorizontalRule margin="none" />

				<AddToNewPlaylistContextMenuItem closePopover={closePopover} />

				<EuiPanel paddingSize="s">
					<AddToSelectable closePopover={closePopover} />
				</EuiPanel>
			</EuiContextMenuPanel>
		</EuiPopover>
	);
};
