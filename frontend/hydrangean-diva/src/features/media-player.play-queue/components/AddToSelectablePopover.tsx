import { mediaPlayerPlaylistsApi } from '@/features/media-player.play-queue/helpers/mediaPlayerPlaylistsApi';
import {
	EuiButton,
	EuiPopover,
	EuiPopoverFooter,
	EuiPopoverTitle,
	EuiSelectable,
	EuiSelectableOption,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { ReactElement, useEffect, useState } from 'react';

interface AddToSelectablePopoverProps {
	disabled: boolean;
	onAddToPlaylist: (option: EuiSelectableOption) => Promise<void>;
}

export const AddToSelectablePopover = ({
	disabled,
	onAddToPlaylist,
}: AddToSelectablePopoverProps): ReactElement => {
	const [isPopoverOpen, setPopoverOpen] = useState(false);

	const [options, setOptions] = useState<EuiSelectableOption[] | 'loading'>(
		'loading',
	);

	useEffect(() => {
		void mediaPlayerPlaylistsApi
			.mediaPlayerPlaylistsGet()
			.then((response) =>
				setOptions(
					response.items.map((item) => ({
						key: item.id,
						label: item.name,
					})),
				),
			);
	}, []);

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
			closePopover={(): void => setPopoverOpen(false)}
		>
			<EuiSelectable
				searchable
				searchProps={{
					compressed: true,
				}}
				options={options === 'loading' ? undefined : options}
				isLoading={options === 'loading'}
				onChange={async (
					option,
					event,
					changedOption,
				): Promise<void> => {
					setPopoverOpen(false);

					await onAddToPlaylist(changedOption);
				}}
				singleSelection
			>
				{(list, search) => (
					<div style={{ width: 240 }}>
						<EuiPopoverTitle paddingSize="s">
							{search}
						</EuiPopoverTitle>
						{list}
						<EuiPopoverFooter paddingSize="s">
							<EuiButton size="s" fullWidth iconType={AddRegular}>
								New playlist{/* LOC */}
							</EuiButton>
						</EuiPopoverFooter>
					</div>
				)}
			</EuiSelectable>
		</EuiPopover>
	);
};
