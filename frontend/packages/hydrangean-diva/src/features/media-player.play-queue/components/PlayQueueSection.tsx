import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { AddVideoButton } from '@/features/media-player.play-queue/components/AddVideoButton';
import { PlayQueueCommandBar } from '@/features/media-player.play-queue/components/PlayQueueCommandBar';
import { PlayQueueTable } from '@/features/media-player.play-queue/components/PlayQueueTable';
import {
	EuiEmptyPrompt,
	EuiPageTemplate,
	EuiSpacer,
	useEuiTheme,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import { type ReactElement } from 'react';

interface PlayQueueSectionProps {
	playQueue: IPlayQueueStore;
}

export const PlayQueueSection = observer(
	({ playQueue }: PlayQueueSectionProps): ReactElement => {
		const { euiTheme } = useEuiTheme();

		return (
			<EuiPageTemplate.Section>
				<PlayQueueCommandBar playQueue={playQueue} />

				<EuiSpacer
					size="l"
					style={{
						position: 'sticky',
						top: 48 + 40,
						zIndex: 998,
						background: euiTheme.colors.backgroundBasePlain,
					}}
				/>

				{playQueue.isEmpty ? (
					<EuiEmptyPrompt
						title={<h2>We couldn't find any videos</h2>}
						body={
							<p>
								Your video library doesn't contain any video
								content.
							</p>
						}
						actions={
							<AddVideoButton onSave={playQueue.addItemFromDto} />
						}
					/>
				) : (
					<PlayQueueTable playQueue={playQueue} />
				)}
			</EuiPageTemplate.Section>
		);
	},
);
