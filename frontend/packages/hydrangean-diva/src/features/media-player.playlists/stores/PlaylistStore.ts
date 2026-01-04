import {
	type HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto,
	type HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto,
	MediaPlayerPlaylistsApi,
} from '@/api';
import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { PlaylistItemStore } from '@/features/media-player.playlists/stores/PlaylistItemStore';
import type { IStateStore, StateChangeEvent } from '@aigamo/route-sphere';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

type PlaylistLocationState = Record<string, never>;

class PlaylistLocationStateStore implements IStateStore<PlaylistLocationState> {
	constructor(private readonly playlist: PlaylistStore) {
		makeObservable(this);
	}

	@computed.struct get state(): PlaylistLocationState {
		return {};
	}
	set state(_value: PlaylistLocationState) {}

	validateState(
		_locationState: any,
	): _locationState is PlaylistLocationState {
		return true /* TODO: implement */;
	}

	@action.bound onStateChange(
		_event: StateChangeEvent<PlaylistLocationState>,
	): Promise<void> {
		return this.playlist.updateResults();
	}
}

export class PlaylistStore {
	readonly locationState: PlaylistLocationStateStore;
	@observable items: PlaylistItemStore[] = [];
	@observable loading = false;

	constructor(
		private readonly playQueue: IPlayQueueStore,
		private readonly mediaPlayerPlaylistsApi: MediaPlayerPlaylistsApi,
		readonly dto: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto,
	) {
		this.locationState = new PlaylistLocationStateStore(this);

		makeObservable(this);
	}

	createItem(
		dto: HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto,
	): PlaylistItemStore {
		return new PlaylistItemStore(this, {
			id: dto.id,
			url: dto.url,
			type: dto.type,
			videoId: dto.videoId,
			title: dto.title,
		});
	}

	@computed get selectedItems(): PlaylistItemStore[] {
		return this.items.filter((item) => item.isSelected);
	}

	@computed get hasSelectedItems(): boolean {
		return this.selectedItems.length > 0;
	}

	@computed get selectedItemsOrAllItems(): PlaylistItemStore[] {
		return this.hasSelectedItems ? this.selectedItems : this.items;
	}

	@action.bound updateResults(): Promise<void> {
		this.loading = true;

		return this.mediaPlayerPlaylistsApi
			.mediaPlayerPlaylistsIdTracksGet({
				id: this.dto.id,
			})
			.then((response) =>
				runInAction(() => {
					const { items } = response;

					this.items = items.map((item) => this.createItem(item));
				}),
			)
			.finally(() =>
				runInAction(() => {
					this.loading = false;
				}),
			);
	}

	@action.bound unselectAll(): void {
		for (const item of this.items) {
			item.unselect();
		}
	}

	@action.bound select(items: PlaylistItemStore[]): void {
		this.unselectAll();

		for (const item of items) {
			item.select();
		}
	}

	@action.bound play(items: PlaylistItemStore[]): void {
		this.playQueue.clearAndSetItems(
			items.map((item) => this.playQueue.createItem(item)),
		);
	}

	@action.bound playSelectedItems(): void {
		this.play(this.selectedItemsOrAllItems);

		this.unselectAll();
	}

	@action.bound playNext(items: PlaylistItemStore[]): Promise<void> {
		return this.playQueue.playNext(
			items.map((item) => this.playQueue.createItem(item)),
		);
	}

	@action.bound async playSelectedItemsNext(): Promise<void> {
		await this.playNext(this.selectedItemsOrAllItems);

		this.unselectAll();
	}

	@action.bound addToPlayQueue(items: PlaylistItemStore[]): Promise<void> {
		return this.playQueue.addItems(
			items.map((item) => this.playQueue.createItem(item)),
		);
	}

	@action.bound async addSelectedItemsToPlayQueue(): Promise<void> {
		await this.addToPlayQueue(this.selectedItemsOrAllItems);

		this.unselectAll();
	}
}
