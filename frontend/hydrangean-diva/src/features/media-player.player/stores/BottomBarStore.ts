import { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { IBottomBarStore } from '@/features/media-player.player/interfaces/IBottomBarStore';
import { IPlayerStore } from '@/features/media-player.player/interfaces/IPlayerStore';

export class BottomBarStore implements IBottomBarStore {
	constructor(
		/* TODO: private */ readonly playerStore: IPlayerStore,
		/* TODO: private */ readonly playQueueStore: IPlayQueueStore,
	) {}
}
