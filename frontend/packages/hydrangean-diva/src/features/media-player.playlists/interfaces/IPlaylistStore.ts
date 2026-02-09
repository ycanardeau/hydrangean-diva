import type { IPlaylistItemStore } from '@/features/media-player.playlists/interfaces/IPlaylistItemStore';

export interface IPlaylistStore {
	readonly items: IPlaylistItemStore[];
	readonly isEmpty: boolean;
	readonly hasMultipleItems: boolean;
	readonly allItemsSelected: boolean;
	setItems(value: IPlaylistItemStore[]): void;
	unselectAll(): void;
	selectAll(): void;
	moveItem(item: IPlaylistItemStore, index: number): void;
	removeItems(items: IPlaylistItemStore[]): Promise<void>;
	removeItemsAbove(item: IPlaylistItemStore): Promise<void>;
	removeOtherItems(item: IPlaylistItemStore): Promise<void>;
}
