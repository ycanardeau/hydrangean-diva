import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { PlayerType } from '@aigamo/nostalgic-diva';
import { action, computed, makeObservable, observable } from 'mobx';

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
		readonly playQueueStore: PlayQueueStore,
		readonly url: string,
		readonly type: PlayerType,
		readonly videoId: string,
		readonly title: string,
	) {
		makeObservable(this);

		this.id = PlayQueueItemStore.nextId++;
	}

	static fromDto(
		playQueueStore: PlayQueueStore,
		dto: PlayQueueItemDto,
	): PlayQueueItemStore {
		return new PlayQueueItemStore(
			playQueueStore,
			dto.url,
			dto.type,
			dto.videoId,
			dto.title,
		);
	}

	@computed get index(): number {
		return this.playQueueStore.items.indexOf(this);
	}

	@computed get isFirst(): boolean {
		return this.index === 0;
	}

	@computed get isLast(): boolean {
		return this.index === this.playQueueStore.items.length - 1;
	}

	@computed get canMoveToTop(): boolean {
		return !this.isFirst;
	}

	@computed get canMoveToBottom(): boolean {
		return !this.isLast;
	}

	@computed get canRemoveToTop(): boolean {
		return !this.isFirst;
	}

	@computed get canRemoveOthers(): boolean {
		return this.playQueueStore.hasMultipleItems;
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
		return this.playQueueStore.createItem(this.toDto());
	}
}
