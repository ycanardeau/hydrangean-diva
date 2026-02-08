import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import type { PlayerType } from '@aigamo/nostalgic-diva';

export interface IPlaylistItemStore {
	readonly id: number;
	readonly isSelected: boolean;
	readonly dto: PlayQueueItemDto;
	readonly url: string;
	readonly type: PlayerType;
	readonly videoId: string;
	readonly title: string;
	readonly isCurrent: boolean;
	unselect(): void;
	select(): void;
	toggleSelected(): void;
}
