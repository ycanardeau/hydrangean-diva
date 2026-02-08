import type { PlayerType } from '@aigamo/nostalgic-diva';

export interface IPlayQueueTableRowStore {
	readonly id: number;
	readonly isSelected: boolean;
	readonly url: string;
	readonly type: PlayerType;
	readonly videoId: string;
	readonly title: string;
	readonly isCurrent: boolean;
	readonly canMoveToTop: boolean;
	readonly canMoveToBottom: boolean;
	readonly canRemoveToTop: boolean;
	readonly canRemoveOthers: boolean;
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
