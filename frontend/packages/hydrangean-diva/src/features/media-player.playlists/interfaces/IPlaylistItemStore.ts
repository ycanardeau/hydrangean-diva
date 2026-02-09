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
	readonly canMoveToTop: boolean;
	readonly canMoveToBottom: boolean;
	readonly canRemoveToTop: boolean;
	readonly canRemoveOthers: boolean;
	unselect(): void;
	select(): void;
	toggleSelected(): void;
	play(): void;
	remove(): Promise<void>;
	playFirst(): Promise<void>;
	playNext(): Promise<void>;
	addToPlayQueue(): Promise<void>;
	moveToTop(): void;
	moveToBottom(): void;
	removeToTop(): Promise<void>;
	removeOthers(): Promise<void>;
}
