import { PlayerType } from '@/controllers/PlayerController';
import { VideoService } from '@/services/VideoService';

// https://github.com/cookpete/react-player/blob/2811bc59b9368170acc20d4f1e39555413d0d9e1/src/patterns.js
const MATCH_URL_TWITCH_VIDEO = /(?:www\.|go\.)?twitch\.tv\/videos\/(\d+)($|\?)/;

export class TwitchVideoService extends VideoService<PlayerType.Twitch> {
	constructor() {
		super(PlayerType.Twitch);
	}

	canPlay(url: string): boolean {
		return MATCH_URL_TWITCH_VIDEO.test(url);
	}

	extractVideoId(url: string): string | undefined {
		const matches = MATCH_URL_TWITCH_VIDEO.exec(url);
		return matches?.[1];
	}
}
