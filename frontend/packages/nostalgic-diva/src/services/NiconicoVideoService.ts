import { VideoService } from '@/services/VideoService';

const MATCH_URL_NICONICO = /(?:www\.|)?nicovideo\.jp\/watch\/(\w+)$/;

export class NiconicoVideoService extends VideoService {
	constructor() {
		super('Niconico');
	}

	canPlay(url: string): boolean {
		return MATCH_URL_NICONICO.test(url);
	}

	extractVideoId(url: string): string | undefined {
		const matches = MATCH_URL_NICONICO.exec(url);
		return matches?.[1];
	}
}
