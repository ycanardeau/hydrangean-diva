import { PlayerType } from '@/controllers/PlayerController';
import { VideoService } from '@/services/VideoService';

// https://github.com/cookpete/react-player/blob/2811bc59b9368170acc20d4f1e39555413d0d9e1/src/patterns.js
const MATCH_URL_YOUTUBE =
	/(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;

export class YouTubeVideoService extends VideoService<PlayerType.YouTube> {
	constructor() {
		super(PlayerType.YouTube);
	}

	canPlay(url: string): boolean {
		return MATCH_URL_YOUTUBE.test(url);
	}

	extractVideoId(url: string): string | undefined {
		const matches = MATCH_URL_YOUTUBE.exec(url);
		return matches?.[1];
	}
}
