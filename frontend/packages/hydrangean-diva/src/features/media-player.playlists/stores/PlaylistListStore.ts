import type { MediaPlayerPlaylistsApi } from '@/api/apis/MediaPlayerPlaylistsApi';
import type { HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto } from '@/api/models/HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto';
import type { IStateStore, StateChangeEvent } from '@aigamo/route-sphere';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

type PlaylistListLocationState = Record<string, never>;

class PlaylistListLocationStateStore implements IStateStore<PlaylistListLocationState> {
	constructor(private readonly playlistList: PlaylistListStore) {
		makeObservable(this);
	}

	@computed.struct get state(): PlaylistListLocationState {
		return {};
	}
	set state(_value: PlaylistListLocationState) {}

	validateState(
		_locationState: unknown,
	): _locationState is PlaylistListLocationState {
		return true /* TODO: implement */;
	}

	@action.bound onStateChange(
		_event: StateChangeEvent<PlaylistListLocationState>,
	): Promise<void> {
		return this.playlistList.updateResults();
	}
}

export class PlaylistListStore {
	readonly locationState: PlaylistListLocationStateStore;
	@observable
	items: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto[] = [];
	@observable loading = false;

	constructor(
		private readonly mediaPlayerPlaylistsApi: MediaPlayerPlaylistsApi,
	) {
		makeObservable(this);

		this.locationState = new PlaylistListLocationStateStore(this);
	}

	@action.bound updateResults(): Promise<void> {
		this.loading = true;

		return this.mediaPlayerPlaylistsApi
			.mediaPlayerPlaylistsGet()
			.then((response) =>
				runInAction(() => {
					const { items } = response;

					this.items = items;
				}),
			)
			.finally(() =>
				runInAction(() => {
					this.loading = false;
				}),
			);
	}
}
