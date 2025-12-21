import {
	HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto,
	MediaPlayerPlaylistsApi,
} from '@/api';
import { IObservableStateProvider } from '@/features/common';
import { PlaylistItemStore } from '@/features/media-player.playlists/stores/PlaylistItemStore';
import { LocationStateStore, StateChangeEvent } from '@aigamo/route-sphere';
import { action, computed, observable, runInAction } from 'mobx';

type PlaylistLocationState = Record<string, never>;

export class PlaylistStore implements LocationStateStore<PlaylistLocationState> {
	items: PlaylistItemStore[] = [];
	loading = false;

	constructor(
		private readonly observableStateProvider: IObservableStateProvider,
		private readonly mediaPlayerPlaylistsApi: MediaPlayerPlaylistsApi,
		private readonly dto: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto,
	) {
		observableStateProvider.makeObservable(this, {
			items: observable,
			loading: observable,
			locationState: computed,
			updateResults: action.bound,
		});
	}

	get locationState(): PlaylistLocationState {
		return {};
	}
	set locationState(value: PlaylistLocationState) {}

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

					this.items = items.map(
						(item) =>
							new PlaylistItemStore(
								this.observableStateProvider,
								this,
								item,
							),
					);
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
}
