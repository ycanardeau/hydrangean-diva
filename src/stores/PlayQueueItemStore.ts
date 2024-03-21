import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, makeObservable, observable } from 'mobx';

export interface PlayQueueItemDto {
	readonly url: string;
	readonly type: PlayerType;
	readonly videoId: string;
	readonly title: string;
}

export class PlayQueueItemStore {
	private static nextId = 1;

	readonly id: number;
	@observable isSelected = false;

	constructor(
		readonly url: string,
		readonly type: PlayerType,
		readonly videoId: string,
		readonly title: string,
	) {
		makeObservable(this);

		this.id = PlayQueueItemStore.nextId++;
	}

	static fromDto(dto: PlayQueueItemDto): PlayQueueItemStore {
		return new PlayQueueItemStore(
			dto.url,
			dto.type,
			dto.videoId,
			dto.title,
		);
	}

	@action unselect(): void {
		this.isSelected = false;
	}

	@action.bound toggleSelected(): void {
		this.isSelected = !this.isSelected;
	}

	toDto(): PlayQueueItemDto {
		return {
			url: this.url,
			type: this.type,
			videoId: this.videoId,
			title: this.title,
		};
	}

	clone(): PlayQueueItemStore {
		return PlayQueueItemStore.fromDto(this.toDto());
	}
}
