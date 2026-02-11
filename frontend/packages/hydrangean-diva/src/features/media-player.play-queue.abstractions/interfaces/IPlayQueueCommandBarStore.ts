import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';

export interface IPlayQueueCommandBarStore {
	readonly canClear: boolean;
	readonly canAddSelectedItems: boolean;
	readonly canPlaySelectedItemsNext: boolean;
	readonly canRemoveSelectedItems: boolean;
	clear(): void;
	playSelectedItemsNext(): Promise<void>;
	addSelectedItems(): Promise<void>;
	removeSelectedItems(): Promise<void>;
	addItemFromDto(dto: PlayQueueItemDto): Promise<void>;
}
