import { PlayerType } from '@/controllers/PlayerController';
import { VideoService } from '@/services/VideoService';

// https://github.com/cookpete/react-player/blob/2811bc59b9368170acc20d4f1e39555413d0d9e1/src/patterns.js
const MATCH_URL_DAILYMOTION =
	/^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?(?:[\w.#_-]+)?/;

export class DailymotionVideoService extends VideoService<PlayerType.Dailymotion> {
	constructor() {
		super(PlayerType.Dailymotion);
	}

	canPlay(url: string): boolean {
		return MATCH_URL_DAILYMOTION.test(url);
	}

	extractVideoId(url: string): string | undefined {
		const matches = MATCH_URL_DAILYMOTION.exec(url);
		return matches?.[1];
	}
}
