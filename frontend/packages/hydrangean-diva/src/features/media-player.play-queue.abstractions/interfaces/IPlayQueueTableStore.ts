import type { IPlayQueueTableRowStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueTableRowStore';

export interface IPlayQueueTableStore {
	readonly items: IPlayQueueTableRowStore[];
	readonly allItemsSelected: boolean;
	setItems(value: IPlayQueueTableRowStore[]): void;
	unselectAll(): void;
	selectAll(): void;
}
