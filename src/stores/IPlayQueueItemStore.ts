import { PlayerType } from '@aigamo/nostalgic-diva';

export interface PlayQueueItemDto {
	readonly url: string;
	readonly type: PlayerType;
	readonly videoId: string;
	readonly title: string;
}

export interface IPlayQueueItemStore {
	readonly id: number;
	isSelected: boolean;
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
	clone(): IPlayQueueItemStore;
	unselect(): void;
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
