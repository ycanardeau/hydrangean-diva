import type { PlayerType } from '@/controllers/PlayerController';

export abstract class VideoService {
	protected constructor(readonly type: PlayerType) {}

	abstract canPlay(url: string): boolean;

	abstract extractVideoId(url: string): string | undefined;
}
