import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { PlayerType } from '@aigamo/nostalgic-diva';

export interface IPlayQueueItemStore {
	readonly id: number;
	readonly dto: PlayQueueItemDto;
	readonly url: string;
	readonly type: PlayerType;
	readonly videoId: string;
	readonly title: string;
	clone(): IPlayQueueItemStore;
}
