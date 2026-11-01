import { EditTimetableModal } from '@/features/media-player/components/EditTimetableModal';
import { useTimetable } from '@/features/media-player/contexts/TimetableContext';
import {
	formatTimetableTime,
	stringifyTimetable,
} from '@/features/media-player/helpers/parseTimetable';
import {
	EuiButtonEmpty,
	EuiButtonIcon,
	EuiCallOut,
	EuiFlexGroup,
	EuiListGroup,
	EuiListGroupItem,
	EuiLoadingSpinner,
	EuiPopover,
	EuiPopoverFooter,
	EuiPopoverTitle,
	EuiText,
} from '@elastic/eui';
import { TextBulletListLtrRegular } from '@fluentui/react-icons';
import EasyModal from 'ez-modal-react';
import { observer } from 'mobx-react-lite';
import { type ReactElement, useState } from 'react';

const TimetableList = observer((): ReactElement => {
	const timetable = useTimetable();

	if (timetable.loading) {
		return (
			<EuiFlexGroup justifyContent="center" css={{ padding: 16 }}>
				<EuiLoadingSpinner size="l" />
			</EuiFlexGroup>
		);
	}

	if (timetable.error !== undefined) {
		return (
			<EuiCallOut
				title="Couldn't fetch the timetable" /* LOC */
				color="danger"
				iconType="warning"
				size="s"
			>
				<p>{timetable.error}</p>
			</EuiCallOut>
		);
	}

	if (timetable.entries === undefined || timetable.entries.length === 0) {
		return (
			<EuiText size="s" color="subdued" css={{ padding: 8 }}>
				<p>
					{timetable.entries === undefined
						? 'No timetable yet. Fetch it from YouTube or paste one.'
						: 'No timetable was found in the video description.'}
					{/* LOC */}
				</p>
			</EuiText>
		);
	}

	return (
		<EuiListGroup flush maxWidth="none" gutterSize="none" size="s">
			{timetable.entries.map((entry, index) => (
				<EuiListGroupItem
					key={index}
					label={
						<>
							<span
								css={{
									fontVariantNumeric: 'tabular-nums',
									marginInlineEnd: 8,
									opacity: 0.7,
								}}
							>
								{formatTimetableTime(entry.seconds)}
							</span>
							{entry.title}
						</>
					}
					isActive={index === timetable.currentEntryIndex}
					onClick={(): Promise<void> => timetable.seekTo(entry)}
					isDisabled={!timetable.canSeek}
					wrapText
				/>
			))}
		</EuiListGroup>
	);
});

export const TimetableButton = observer((): ReactElement => {
	const timetable = useTimetable();

	const [isOpen, setIsOpen] = useState(false);

	const handleClickEdit = async (): Promise<void> => {
		setIsOpen(false);

		const result = await EasyModal.show(EditTimetableModal, {
			text: stringifyTimetable(timetable.entries ?? []),
		});
		timetable.setText(result.text);
	};

	return (
		<EuiPopover
			button={
				<EuiButtonIcon
					title="Timetable" /* LOC */
					aria-label="Timetable" /* LOC */
					iconType={TextBulletListLtrRegular}
					size="s"
					iconSize="l"
					onClick={(): void => setIsOpen(!isOpen)}
					disabled={timetable.currentItem === undefined}
				/>
			}
			isOpen={isOpen}
			closePopover={(): void => setIsOpen(false)}
			anchorPosition="upRight"
			panelPaddingSize="s"
			panelStyle={{ inlineSize: 360 }}
		>
			<EuiPopoverTitle paddingSize="s">
				Timetable{/* LOC */}
			</EuiPopoverTitle>

			<div className="eui-yScroll" css={{ maxBlockSize: '50vh' }}>
				<TimetableList />
			</div>

			<EuiPopoverFooter paddingSize="s">
				<EuiFlexGroup
					responsive={false}
					gutterSize="s"
					justifyContent="flexEnd"
				>
					{timetable.currentItem?.type === 'YouTube' && (
						<EuiButtonEmpty
							size="s"
							iconType="refresh"
							onClick={timetable.fetch}
							isDisabled={!timetable.canFetch}
							title={
								timetable.canFetch
									? undefined
									: 'Set a YouTube Data API key in the settings to fetch timetables.' /* LOC */
							}
						>
							Fetch from YouTube{/* LOC */}
						</EuiButtonEmpty>
					)}
					<EuiButtonEmpty
						size="s"
						iconType="pencil"
						onClick={handleClickEdit}
						isDisabled={!timetable.canEdit}
					>
						Edit{/* LOC */}
					</EuiButtonEmpty>
				</EuiFlexGroup>
			</EuiPopoverFooter>
		</EuiPopover>
	);
});
