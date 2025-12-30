import { PlayQueueStore } from '@/features/media-player.play-queue/stores/PlayQueueStore';
import { EuiButton, EuiCodeBlock, EuiFlyout } from '@elastic/eui';
import { WindowDevToolsRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { ReactElement, useState } from 'react';

interface DeveloperToolsButtonProps {
	playQueue: PlayQueueStore;
}

export const DeveloperToolsButton = observer(
	({ playQueue }: DeveloperToolsButtonProps): ReactElement => {
		const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);

		return (
			<>
				{isFlyoutVisible && (
					<EuiFlyout
						type="push"
						size="s"
						onClose={(): void => setIsFlyoutVisible(false)}
					>
						<div style={{ blockSize: '100%' }}>
							<EuiCodeBlock
								language="json"
								overflowHeight="100%"
								isCopyable
								isVirtualized
							>
								{JSON.stringify(
									playQueue.localStorageState,
									undefined,
									2,
								)}
							</EuiCodeBlock>
						</div>
					</EuiFlyout>
				)}

				<EuiButton
					onClick={(): void =>
						setIsFlyoutVisible((visible) => !visible)
					}
					iconType={WindowDevToolsRegular}
				>
					Developer tools
				</EuiButton>
			</>
		);
	},
);
