import type { IPlaylistItemStore } from '@/features/media-player.playlists/interfaces/IPlaylistItemStore';

export interface IPlaylistStore {
	readonly items: IPlaylistItemStore[];
	readonly isEmpty: boolean;
	readonly allItemsSelected: boolean;
	setItems(value: IPlaylistItemStore[]): void;
	unselectAll(): void;
	selectAll(): void;
}
