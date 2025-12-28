import {
	IPlayQueueStore,
	RepeatMode,
} from '@/features/media-player.play-queue.abstractions';
import { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';
import { IPlayerController } from '@aigamo/nostalgic-diva';

export interface IBottomBarStore {
	readonly controller: IPlayerController;
	readonly playing: boolean;
	readonly currentItem: IPlayQueueItemStore | undefined;
	readonly repeat: RepeatMode;
	readonly shuffle: boolean;
	readonly canToggleRepeat: boolean;
	readonly canToggleShuffle: boolean;
	readonly canPlay: boolean;
	readonly canPause: boolean;
	readonly canPrevious: boolean;
	readonly canNext: boolean;
	readonly canSkipBack10: boolean;
	readonly canSkipForward30: boolean;
	readonly canRemoveFromPlayQueue: boolean;
	toggleRepeat(): void;
	toggleShuffle(): void;
	play(): Promise<void>;
	pause(): Promise<void>;
	previous(): Promise<void>;
	next(): Promise<void>;
	skipBack10(): Promise<void>;
	skipForward30(): Promise<void>;
	removeFromPlayQueue(): Promise<void>;

	// TODO: Remove these deprecated properties in the future
	/** @deprecated */ readonly playerStore: IPlayerStore;
	/** @deprecated */ readonly playQueueStore: IPlayQueueStore;
}
