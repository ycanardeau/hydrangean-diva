import {
	HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto,
	HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto,
	MediaPlayerPlaylistsApi,
} from '@/api';
import { IObservableStateProvider } from '@/features/common';
import { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import { PlaylistItemStore } from '@/features/media-player.playlists/stores/PlaylistItemStore';
import { LocationStateStore, StateChangeEvent } from '@aigamo/route-sphere';
import { action, computed, observable, runInAction } from 'mobx';

type PlaylistLocationState = Record<string, never>;

export class PlaylistStore implements LocationStateStore<PlaylistLocationState> {
	items: PlaylistItemStore[] = [];
	loading = false;

	constructor(
		private readonly playQueue: IPlayQueueStore,
		private readonly observableStateProvider: IObservableStateProvider,
		private readonly mediaPlayerPlaylistsApi: MediaPlayerPlaylistsApi,
		private readonly dto: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto,
	) {
		observableStateProvider.makeObservable(this, {
			items: observable,
			loading: observable,
			locationState: computed,
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

	get locationState(): PlaylistLocationState {
		return {};
	}
	set locationState(value: PlaylistLocationState) {}

	get selectedItems(): PlaylistItemStore[] {
		return this.items.filter((item) => item.isSelected);
	}

	get hasSelectedItems(): boolean {
		return this.selectedItems.length > 0;
	}

	get selectedItemsOrAllItems(): PlaylistItemStore[] {
		return this.hasSelectedItems ? this.selectedItems : this.items;
	}

	validateLocationState(
		locationState: any,
	): locationState is PlaylistLocationState {
		return true /* TODO: implement */;
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

	onLocationStateChange = (
		event: StateChangeEvent<PlaylistLocationState>,
	): Promise<void> => {
		return this.updateResults();
	};

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
