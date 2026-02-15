import { Compose } from '@/features/common/components/Compose';
import { BottomBarProvider } from '@/features/media-player.bottom-bar/components/BottomBarProvider';
import { MiniPlayerProvider } from '@/features/media-player.mini-player/components/MiniPlayerProvider';
import { PlayQueueProvider } from '@/features/media-player.play-queue/components/PlayQueueProvider';
import { PlayerProvider } from '@/features/media-player.player/components/PlayerProvider';
import { PlaylistListProvider } from '@/features/media-player.playlists/components/PlaylistListProvider';
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
					BottomBarProvider,
					MiniPlayerProvider,
					PlaylistListProvider,
				]}
			>
				{children}
			</Compose>
		</NostalgicDivaProvider>
	);
};
