import { VideoService } from '@/services/VideoService';

// Matches `https://open.spotify.com/track/<id>` (with an optional `intl-xx`
// locale segment and query string) as well as bare `spotify:track:<id>` URIs.
const SPOTIFY_TYPES = 'track|episode|album|playlist|show|artist';
const MATCH_URL_SPOTIFY = new RegExp(
	`^https?://open\\.spotify\\.com/(?:intl-[a-z]{2}/)?(${SPOTIFY_TYPES})/([a-zA-Z0-9]+)`,
);
const MATCH_URI_SPOTIFY = new RegExp(
	`^spotify:(${SPOTIFY_TYPES}):([a-zA-Z0-9]+)$`,
);

export class SpotifyVideoService extends VideoService {
	constructor() {
		super('Spotify');
	}

	canPlay(url: string): boolean {
		return MATCH_URL_SPOTIFY.test(url) || MATCH_URI_SPOTIFY.test(url);
	}

	// The Spotify iframe API is driven by Spotify URIs (`spotify:track:<id>`),
	// so normalize both URLs and URIs down to that form.
	extractVideoId(url: string): string | undefined {
		const match =
			MATCH_URL_SPOTIFY.exec(url) ?? MATCH_URI_SPOTIFY.exec(url);
		if (match === null) {
			return undefined;
		}

		const [, type, id] = match;
		return `spotify:${type}:${id}`;
	}
}
