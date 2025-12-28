import { IPlayQueueItemStore } from '@/features/media-player.play-queue.abstractions/interfaces/IPlayQueueItemStore';
import { IPlayerController, TimeEvent } from '@aigamo/nostalgic-diva';

export interface IMiniPlayerStore {
	readonly controller: IPlayerController;
	readonly currentItem: IPlayQueueItemStore | undefined;
	onLoaded(): Promise<void>;
	onPlay(): void;
	onPause(): void;
	onEnded(): Promise<void>;
	onTimeUpdate(event: TimeEvent): void;
	onControllerChange(value: IPlayerController): void;
}
