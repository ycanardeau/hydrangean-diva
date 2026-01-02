import { PlayerType } from '@/controllers/PlayerController';

export abstract class VideoService<TPlayerType extends PlayerType> {
	protected constructor(readonly type: TPlayerType) {}

	abstract canPlay(url: string): boolean;

	abstract extractVideoId(url: string): string | undefined;
}
