import { LocationStateStore, StateChangeEvent } from '@aigamo/route-sphere';
import { action, computed, observable, runInAction } from 'mobx';

import {
	HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto,
	MediaPlayerPlaylistsApi,
} from '@/api';
import { IObservableStateProvider } from '@/features/common/interfaces/IObservableStateProvider';

type PlaylistListLocationState = Record<string, never>;

export class PlaylistListStore
	implements LocationStateStore<PlaylistListLocationState>
{
	items: HydrangeanDivaMediaPlayerContractsPlaylistsDtosPlaylistDto[] = [];
	loading = false;

	constructor(
		observableStateProvider: IObservableStateProvider,
		private readonly mediaPlayerPlaylistsApi: MediaPlayerPlaylistsApi,
	) {
		observableStateProvider.makeObservable(this, {
			items: observable,
			loading: observable,
			locationState: computed,
			updateResults: action.bound,
		});
	}

	get locationState(): PlaylistListLocationState {
		return {};
	}
	set locationState(value: PlaylistListLocationState) {}

	validateLocationState(
		locationState: any,
	): locationState is PlaylistListLocationState {
		return true /* TODO: implement */;
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

	onLocationStateChange = (
		event: StateChangeEvent<PlaylistListLocationState>,
	): Promise<void> => {
		return this.updateResults();
	};
}
