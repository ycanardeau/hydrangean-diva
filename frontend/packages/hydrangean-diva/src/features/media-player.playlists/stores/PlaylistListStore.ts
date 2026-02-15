import type { IPlaylistListItemStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListItemStore';
import type { IPlaylistListStore } from '@/features/media-player.playlists.abstractions/interfaces/IPlaylistListStore';
import { PlaylistListItemStore } from '@/features/media-player.playlists/stores/PlaylistListItemStore';
import type { IStateStore } from '@aigamo/route-sphere';
import { pull } from 'lodash-es';
import { action, computed, makeObservable, observable } from 'mobx';

interface PlaylistListLocalStorageState {
	items?: {
		id: string;
		name: string;
	}[];
}

class PlaylistListLocalStorageStateStore implements IStateStore<PlaylistListLocalStorageState> {
	constructor(private readonly playlistList: PlaylistListStore) {
		makeObservable(this);
	}

	@computed.struct get state(): PlaylistListLocalStorageState {
		return {
			items: this.playlistList.items.map((item) => ({
				id: item.id,
				name: item.name,
			})),
		};
	}
	set state(value: PlaylistListLocalStorageState) {
		this.playlistList.items =
			value.items?.map(
				(item) =>
					new PlaylistListItemStore(
						this.playlistList,
						item.id,
						item.name,
					),
			) ?? [];
	}

	validateState(state: unknown): state is PlaylistListLocalStorageState {
		return true /* TODO: implement */;
	}
}

export class PlaylistListStore implements IPlaylistListStore {
	readonly localStorageState: PlaylistListLocalStorageStateStore;
	@observable
	items: IPlaylistListItemStore[] = [];

	constructor() {
		makeObservable(this);

		this.localStorageState = new PlaylistListLocalStorageStateStore(this);
	}

	createItem(name: string): IPlaylistListItemStore {
		return new PlaylistListItemStore(this, crypto.randomUUID(), name);
	}

	@action.bound setItems(value: IPlaylistListItemStore[]): void {
		this.items = value;
	}

	@action.bound async addItem(item: IPlaylistListItemStore): Promise<void> {
		this.items.push(item);
	}

	@action.bound async removeItem(
		item: IPlaylistListItemStore,
	): Promise<void> {
		pull(this.items, item);
	}
}
