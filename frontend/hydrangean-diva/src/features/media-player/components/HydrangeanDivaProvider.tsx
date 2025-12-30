import { Compose } from '@/features/common/components/Compose';
import { PlayQueueStoreProvider } from '@/features/media-player.play-queue/components/PlayQueueStoreProvider';
import { PlayerStoreProvider } from '@/features/media-player.player/components/PlayerStoreProvider';
import { BottomBarStoreProvider } from '@/features/media-player.player/components/bottom-bar/BottomBarStoreProvider';
import { MiniPlayerStoreProvider } from '@/features/media-player.player/components/mini-player/MiniPlayerStoreProvider';
import {
	NostalgicDivaProvider,
	NostalgicDivaProviderProps,
} from '@aigamo/nostalgic-diva';
import { ReactElement, ReactNode } from 'react';

export interface HydrangeanDivaProviderProps {
	children?: ReactNode;
	nostalgicDivaProps?: NostalgicDivaProviderProps;
}

export const HydrangeanDivaProvider = ({
	children,
	nostalgicDivaProps,
}: HydrangeanDivaProviderProps): ReactElement => {
	return (
		<NostalgicDivaProvider {...nostalgicDivaProps}>
			<Compose
				components={[
					PlayerStoreProvider,
					PlayQueueStoreProvider,
					MiniPlayerStoreProvider,
					BottomBarStoreProvider,
				]}
			>
				{children}
			</Compose>
		</NostalgicDivaProvider>
	);
};
