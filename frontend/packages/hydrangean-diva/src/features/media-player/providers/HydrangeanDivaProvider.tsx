import { BottomBarProvider } from '@/features/media-player/providers/BottomBarProvider';
import { MiniPlayerProvider } from '@/features/media-player/providers/MiniPlayerProvider';
import { PlayQueueProvider } from '@/features/media-player/providers/PlayQueueProvider';
import { PlayerProvider } from '@/features/media-player/providers/PlayerProvider';
import { PlaylistListProvider } from '@/features/media-player/providers/PlaylistListProvider';
import { Compose } from '@/shared/components/Compose';
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
