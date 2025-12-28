import { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions';
import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';

export interface IBottomBarStore {
	// TODO: Remove these
	playerStore: IPlayerStore;
	playQueueStore: IPlayQueueStore;
}
