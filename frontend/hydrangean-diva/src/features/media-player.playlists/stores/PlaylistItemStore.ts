import { HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto } from '@/api';
import { IObservableStateProvider } from '@/features/common';
import { PlaylistStore } from '@/features/media-player.playlists/stores/PlaylistStore';
import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, computed, observable } from 'mobx';

export class PlaylistItemStore {
	static nextId = 1;

	readonly id: number;
	isSelected = false;

	constructor(
		observableStateProvider: IObservableStateProvider,
		private readonly playlist: PlaylistStore,
		private readonly dto: HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto,
	) {
		this.id = PlaylistItemStore.nextId++;

		observableStateProvider.makeObservable(this, {
			isSelected: observable,
			index: computed,
			unselect: action.bound,
			select: action.bound,
			play: action.bound,
		});
	}

	get url(): string {
		return this.dto.url;
	}

	get type(): PlayerType {
		return this.dto.type as PlayerType;
	}

	get videoId(): string {
		return this.dto.videoId;
	}

	get title(): string {
		return this.dto.title;
	}

	get index(): number {
		return this.playlist.items.indexOf(this);
	}

	unselect(): void {
		this.isSelected = false;
	}

	select(): void {
		this.isSelected = true;
	}

	play(): void {
		throw new Error('Method not implemented.');
	}
}
