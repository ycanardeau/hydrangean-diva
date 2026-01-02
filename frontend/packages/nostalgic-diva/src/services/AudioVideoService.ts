import { PlayerType } from '@/controllers/PlayerController';
import { VideoService } from '@/services/VideoService';

// https://github.com/cookpete/react-player/blob/2811bc59b9368170acc20d4f1e39555413d0d9e1/src/patterns.js
const AUDIO_EXTENSIONS =
	/\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;

export class AudioVideoService extends VideoService<PlayerType.Audio> {
	constructor() {
		super(PlayerType.Audio);
	}

	canPlay(url: string): boolean {
		return AUDIO_EXTENSIONS.test(url) || VIDEO_EXTENSIONS.test(url);
	}

	extractVideoId(url: string): string | undefined {
		return url;
	}
}
