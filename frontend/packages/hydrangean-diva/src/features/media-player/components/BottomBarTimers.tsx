import { useBottomBar } from '@/features/media-player/contexts/BottomBarContext';
import { formatTime } from '@/features/media-player/helpers/formatTime';
import { EuiText } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import type { ReactElement } from 'react';

export const FullTime = observer((): ReactElement => {
	const bottomBar = useBottomBar();

	return (
		<EuiText
			size="xs"
			color="subdued"
			css={{
				fontVariantNumeric: 'tabular-nums',
				whiteSpace: 'nowrap',
			}}
		>
			{formatTime(bottomBar.duration)}
		</EuiText>
	);
});

export const RemainingTime = observer((): ReactElement => {
	const bottomBar = useBottomBar();

	return (
		<EuiText
			size="xs"
			color="subdued"
			css={{
				fontVariantNumeric: 'tabular-nums',
				whiteSpace: 'nowrap',
			}}
		>
			-{formatTime(bottomBar.remainingTime)}
		</EuiText>
	);
});
