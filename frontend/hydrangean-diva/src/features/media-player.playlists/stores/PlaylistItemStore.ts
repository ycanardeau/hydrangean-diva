import { HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto } from '@/api';
import { IObservableStateProvider } from '@/features/common';
import { PlaylistStore } from '@/features/media-player.playlists/stores/PlaylistStore';
import { PlayerType } from '@aigamo/nostalgic-diva';

export class PlaylistItemStore {
	constructor(
		observableStateProvider: IObservableStateProvider,
		playlistStore: PlaylistStore,
		private readonly dto: HydrangeanDivaMediaPlayerContractsPlaylistsDtosTrackDto,
	) {}

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
}
