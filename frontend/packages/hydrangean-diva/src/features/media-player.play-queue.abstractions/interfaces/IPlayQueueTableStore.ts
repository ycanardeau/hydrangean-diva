import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';

import type { IPlayQueueTableRowStore } from './IPlayQueueTableRowStore';

export interface IPlayQueueTableStore {
	readonly items: IPlayQueueTableRowStore[];
	createItem(dto: PlayQueueItemDto): IPlayQueueTableRowStore;
	readonly isEmpty: boolean;
	readonly canClear: boolean;
	readonly currentItem: IPlayQueueTableRowStore | undefined;
	readonly hasMultipleItems: boolean;
	readonly hasPreviousItem: boolean;
	readonly hasNextItem: boolean;
	readonly isLastItem: boolean;
	readonly selectedItems: IPlayQueueTableRowStore[];
	readonly allItemsSelected: boolean;
	readonly selectedItemsOrAllItems: IPlayQueueTableRowStore[];
	readonly canAddSelectedItems: boolean;
	readonly canPlaySelectedItemsNext: boolean;
	readonly canRemoveSelectedItems: boolean;
	setItems(value: IPlayQueueTableRowStore[]): void;
	clear(): void;
	unselectAll(): void;
	selectAll(): void;
	setCurrentItem(item: IPlayQueueTableRowStore | undefined): void;
	clearAndSetItems(items: IPlayQueueTableRowStore[]): void;
	playNext(items: IPlayQueueTableRowStore[]): Promise<void>;
	playSelectedItemsNext(): Promise<void>;
	addItems(items: IPlayQueueTableRowStore[]): Promise<void>;
	addSelectedItems(): Promise<void>;
	playFirst(items: IPlayQueueTableRowStore[]): Promise<void>;
	moveItem(item: IPlayQueueTableRowStore, index: number): void;
	goToFirst(): Promise<void>;
	removeItems(items: IPlayQueueTableRowStore[]): Promise<void>;
	removeSelectedItems(): Promise<void>;
	removeItemsAbove(item: IPlayQueueTableRowStore): Promise<void>;
	removeOtherItems(item: IPlayQueueTableRowStore): Promise<void>;
}
