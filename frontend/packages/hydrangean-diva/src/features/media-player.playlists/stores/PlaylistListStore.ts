import {
	type HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto,
	MediaPlayerPlaylistsApi,
} from '@/api';
import type { IObservableStateProvider } from '@/features/common/interfaces/IObservableStateProvider';
import type {
	IReactiveStateStore,
	StateChangeEvent,
} from '@aigamo/route-sphere';
import { action, computed, observable, runInAction } from 'mobx';

type PlaylistListLocationState = Record<string, never>;

class PlaylistListLocationStateStore implements IReactiveStateStore<PlaylistListLocationState> {
	constructor(
		observableStateProvider: IObservableStateProvider,
		private readonly playlistList: PlaylistListStore,
	) {
		observableStateProvider.makeObservable(this, {
			state: computed,
			onStateChange: action.bound,
		});
	}

	get state(): PlaylistListLocationState {
		return {};
	}
	set state(_value: PlaylistListLocationState) {}

	validateState(
		_locationState: any,
	): _locationState is PlaylistListLocationState {
		return true /* TODO: implement */;
	}

	onStateChange(
		_event: StateChangeEvent<PlaylistListLocationState>,
	): Promise<void> {
		return this.playlistList.updateResults();
	}
}

export class PlaylistListStore {
	readonly locationState: PlaylistListLocationStateStore;
	items: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto[] = [];
	loading = false;

	constructor(
		observableStateProvider: IObservableStateProvider,
		private readonly mediaPlayerPlaylistsApi: MediaPlayerPlaylistsApi,
	) {
		this.locationState = new PlaylistListLocationStateStore(
			observableStateProvider,
			this,
		);

		observableStateProvider.makeObservable(this, {
			items: observable,
			loading: observable,
			updateResults: action.bound,
		});
	}

	updateResults(): Promise<void> {
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
