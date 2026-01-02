import { PlayerType } from '@/controllers/PlayerController';
import { VideoService } from '@/services/VideoService';

// https://github.com/cookpete/react-player/blob/2811bc59b9368170acc20d4f1e39555413d0d9e1/src/patterns.js
const MATCH_URL_VIMEO = /vimeo\.com\/(\d+)$/;

export class VimeoVideoService extends VideoService<PlayerType.Vimeo> {
	constructor() {
		super(PlayerType.Vimeo);
	}

	canPlay(url: string): boolean {
		return MATCH_URL_VIMEO.test(url);
	}

	extractVideoId(url: string): string | undefined {
		return MATCH_URL_VIMEO.exec(url)?.[1];
	}
}
