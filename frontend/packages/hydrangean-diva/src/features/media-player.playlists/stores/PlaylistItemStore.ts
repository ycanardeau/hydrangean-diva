import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import type { IPlaylistItemStore } from '@/features/media-player.playlists/interfaces/IPlaylistItemStore';
import type { IPlaylistStore } from '@/features/media-player.playlists/interfaces/IPlaylistStore';
import type { PlayerType } from '@aigamo/nostalgic-diva';
import { action, computed, makeObservable, observable } from 'mobx';

export class PlaylistItemStore implements IPlaylistItemStore {
	static nextId = 1;

	readonly id: number;
	@observable isSelected = false;

	constructor(
		readonly playlist: IPlaylistStore,
		readonly dto: PlayQueueItemDto,
	) {
		makeObservable(this);

		this.id = PlaylistItemStore.nextId++;
	}

	static fromDto(
		playlist: IPlaylistStore,
		dto: PlayQueueItemDto,
	): IPlaylistItemStore {
		return new PlaylistItemStore(playlist, dto);
	}

	get url(): string {
		return this.dto.url;
	}

	get type(): PlayerType {
		return this.dto.type;
	}

	get videoId(): string {
		return this.dto.videoId;
	}

	get title(): string {
		return this.dto.title;
	}

	@computed get isCurrent(): boolean {
		return false; /* TODO */
	}

	@action.bound unselect(): void {
		this.isSelected = false;
	}

	@action.bound select(): void {
		this.isSelected = true;
	}

	@action.bound toggleSelected(): void {
		this.isSelected = !this.isSelected;
	}
}
