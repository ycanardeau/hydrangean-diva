import { Compose } from '@/features/common/components/Compose';
import { PlayQueueProvider } from '@/features/media-player.play-queue/components/PlayQueueProvider';
import { PlayerProvider } from '@/features/media-player.player/components/PlayerProvider';
import { BottomBarProvider } from '@/features/media-player.player/components/bottom-bar/BottomBarProvider';
import { MiniPlayerProvider } from '@/features/media-player.player/components/mini-player/MiniPlayerProvider';
import {
	NostalgicDivaProvider,
	type NostalgicDivaProviderProps,
} from '@aigamo/nostalgic-diva';
import type { ReactElement, ReactNode } from 'react';

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
					PlayerProvider,
					PlayQueueProvider,
					MiniPlayerProvider,
					BottomBarProvider,
				]}
			>
				{children}
			</Compose>
		</NostalgicDivaProvider>
	);
};
