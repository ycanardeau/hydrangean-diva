import type { HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto } from '@/api/models/HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto';
import { PlaylistStore } from '@/features/media-player.playlists/stores/PlaylistStore';
import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, computed, makeObservable, observable } from 'mobx';

export class PlaylistItemStore {
	static nextId = 1;

	readonly id: number;
	@observable isSelected = false;

	constructor(
		private readonly playlist: PlaylistStore,
		private readonly dto: HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto,
	) {
		makeObservable(this);

		this.id = PlaylistItemStore.nextId++;
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

	@computed get index(): number {
		return this.playlist.items.indexOf(this);
	}

	@action.bound unselect(): void {
		this.isSelected = false;
	}

	@action.bound select(): void {
		this.isSelected = true;
	}

	@action.bound play(): void {
		throw new Error('Method not implemented.');
	}
}
