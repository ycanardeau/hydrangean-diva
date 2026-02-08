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

export class PlaylistListItemStore {
	@observable id: string;
	@observable name: string;

	constructor(
		private readonly playlistList: PlaylistListStore,
		id: string,
		name: string,
	) {
		makeObservable(this);

		this.id = id;
		this.name = name;
	}

	@action.bound async rename(name: string): Promise<void> {
		this.name = name;
	}

	@action.bound remove(): Promise<void> {
		return this.playlistList.removeItem(this);
	}
}

export class PlaylistListStore {
	readonly localStorageState: PlaylistListLocalStorageStateStore;
	@observable
	items: PlaylistListItemStore[] = [];

	constructor() {
		makeObservable(this);

		this.localStorageState = new PlaylistListLocalStorageStateStore(this);
	}

	createItem(name: string): PlaylistListItemStore {
		return new PlaylistListItemStore(this, crypto.randomUUID(), name);
	}

	@action.bound async addItem(item: PlaylistListItemStore): Promise<void> {
		this.items.push(item);
	}

	@action.bound async removeItem(item: PlaylistListItemStore): Promise<void> {
		pull(this.items, item);
	}
}
