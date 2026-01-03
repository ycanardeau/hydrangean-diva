import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { PlayerType } from '@aigamo/nostalgic-diva';

export interface IPlayQueueTableRowStore {
	readonly id: number;
	readonly isSelected: boolean;
	readonly dto: PlayQueueItemDto;
	readonly url: string;
	readonly type: PlayerType;
	readonly videoId: string;
	readonly title: string;
	readonly canMoveToTop: boolean;
	readonly canMoveToBottom: boolean;
	readonly canRemoveToTop: boolean;
	readonly canRemoveOthers: boolean;
	readonly isCurrent: boolean;
	clone(): IPlayQueueTableRowStore;
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
