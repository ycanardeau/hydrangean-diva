import type { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import type { IPlayQueueStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueStore';
import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { PlayerType } from '@aigamo/nostalgic-diva';

export class PlayQueueItemStore implements IPlayQueueItemStore {
	static nextId = 1;

	readonly id: number;

	constructor(
		readonly playQueue: IPlayQueueStore,
		readonly dto: PlayQueueItemDto,
	) {
		this.id = PlayQueueItemStore.nextId++;
	}

	static fromDto(
		playQueue: IPlayQueueStore,
		dto: PlayQueueItemDto,
	): IPlayQueueItemStore {
		return new PlayQueueItemStore(playQueue, dto);
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

	clone(): IPlayQueueItemStore {
		return this.playQueue.createItem(this.dto);
	}
}
