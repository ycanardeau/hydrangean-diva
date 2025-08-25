import { PlayerType } from '@aigamo/nostalgic-diva';

export interface PlayQueueItemDto {
	readonly url: string;
	readonly type: PlayerType;
	readonly videoId: string;
	readonly title: string;
}
