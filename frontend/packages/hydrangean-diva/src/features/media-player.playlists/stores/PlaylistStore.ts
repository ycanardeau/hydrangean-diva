import {
	type HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto,
	type HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto,
	MediaPlayerPlaylistsApi,
} from '@/api';
import type { IObservableStateProvider } from '@/features/common/interfaces/IObservableStateProvider';
import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { PlaylistItemStore } from '@/features/media-player.playlists/stores/PlaylistItemStore';
import type {
	IReactiveStateStore,
	StateChangeEvent,
} from '@aigamo/route-sphere';
import { action, computed, observable, runInAction } from 'mobx';

type PlaylistLocationState = Record<string, never>;

class PlaylistLocationStateStore implements IReactiveStateStore<PlaylistLocationState> {
	constructor(
		observableStateProvider: IObservableStateProvider,
		private readonly playlist: PlaylistStore,
	) {
		observableStateProvider.makeObservable(this, {
			state: computed,
			onStateChange: action.bound,
		});
	}

	get state(): PlaylistLocationState {
		return {};
	}
	set state(_value: PlaylistLocationState) {}

	validateState(
		_locationState: any,
	): _locationState is PlaylistLocationState {
		return true /* TODO: implement */;
	}

	onStateChange(
		_event: StateChangeEvent<PlaylistLocationState>,
	): Promise<void> {
		return this.playlist.updateResults();
	}
}

export class PlaylistStore {
	readonly locationState: PlaylistLocationStateStore;
	items: PlaylistItemStore[] = [];
	loading = false;

	constructor(
		private readonly playQueue: IPlayQueueStore,
		private readonly observableStateProvider: IObservableStateProvider,
		private readonly mediaPlayerPlaylistsApi: MediaPlayerPlaylistsApi,
		readonly dto: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto,
	) {
		this.locationState = new PlaylistLocationStateStore(
			observableStateProvider,
			this,
		);

		observableStateProvider.makeObservable(this, {
			items: observable,
			loading: observable,
			selectedItems: computed,
			hasSelectedItems: computed,
			selectedItemsOrAllItems: computed,
			updateResults: action.bound,
			unselectAll: action.bound,
			select: action.bound,
			play: action.bound,
			playSelectedItems: action.bound,
			playNext: action.bound,
			playSelectedItemsNext: action.bound,
			addToPlayQueue: action.bound,
			addSelectedItemsToPlayQueue: action.bound,
		});
	}

	createItem(
		dto: HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto,
	): PlaylistItemStore {
		return new PlaylistItemStore(this.observableStateProvider, this, {
			id: dto.id,
			url: dto.url,
			type: dto.type,
			videoId: dto.videoId,
			title: dto.title,
		});
	}

	get selectedItems(): PlaylistItemStore[] {
		return this.items.filter((item) => item.isSelected);
	}

	get hasSelectedItems(): boolean {
		return this.selectedItems.length > 0;
	}

	get selectedItemsOrAllItems(): PlaylistItemStore[] {
		return this.hasSelectedItems ? this.selectedItems : this.items;
	}

	updateResults(): Promise<void> {
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

	unselectAll(): void {
		for (const item of this.items) {
			item.unselect();
		}
	}

	select(items: PlaylistItemStore[]): void {
		this.unselectAll();

		for (const item of items) {
			item.select();
		}
	}

	play(items: PlaylistItemStore[]): void {
		this.playQueue.clearAndSetItems(
			items.map((item) => this.playQueue.createItem(item)),
		);
	}

	playSelectedItems(): void {
		this.play(this.selectedItemsOrAllItems);

		this.unselectAll();
	}

	playNext(items: PlaylistItemStore[]): Promise<void> {
		return this.playQueue.playNext(
			items.map((item) => this.playQueue.createItem(item)),
		);
	}

	async playSelectedItemsNext(): Promise<void> {
		await this.playNext(this.selectedItemsOrAllItems);

		this.unselectAll();
	}

	addToPlayQueue(items: PlaylistItemStore[]): Promise<void> {
		return this.playQueue.addItems(
			items.map((item) => this.playQueue.createItem(item)),
		);
	}

	async addSelectedItemsToPlayQueue(): Promise<void> {
		await this.addToPlayQueue(this.selectedItemsOrAllItems);

		this.unselectAll();
	}
}
