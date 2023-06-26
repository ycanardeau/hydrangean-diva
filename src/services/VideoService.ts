import { PlayerType } from '@aigamo/nostalgic-diva';

// https://github.com/cookpete/react-player/blob/2811bc59b9368170acc20d4f1e39555413d0d9e1/src/patterns.js
export const MATCH_URL_YOUTUBE =
	/(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
export const MATCH_URL_SOUNDCLOUD = /(?:soundcloud\.com|snd\.sc)\/[^.]+$/;
export const MATCH_URL_VIMEO = /vimeo\.com\/(\d+)$/;
export const MATCH_URL_FACEBOOK =
	/^https?:\/\/(www\.)?facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/;
export const MATCH_URL_FACEBOOK_WATCH = /^https?:\/\/fb\.watch\/.+$/;
export const MATCH_URL_STREAMABLE = /streamable\.com\/([a-z0-9]+)$/;
export const MATCH_URL_WISTIA =
	/(?:wistia\.(?:com|net)|wi\.st)\/(?:medias|embed)\/(?:iframe\/)?([^?]+)/;
export const MATCH_URL_TWITCH_VIDEO =
	/(?:www\.|go\.)?twitch\.tv\/videos\/(\d+)($|\?)/;
export const MATCH_URL_TWITCH_CHANNEL =
	/(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)($|\?)/;
export const MATCH_URL_DAILYMOTION =
	/^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?(?:[\w.#_-]+)?/;
export const MATCH_URL_MIXCLOUD = /mixcloud\.com\/([^/]+\/[^/]+)/;
export const MATCH_URL_VIDYARD = /vidyard.com\/(?:watch\/)?([a-zA-Z0-9-_]+)/;
export const MATCH_URL_KALTURA =
	/^https?:\/\/[a-zA-Z]+\.kaltura.(com|org)\/p\/([0-9]+)\/sp\/([0-9]+)00\/embedIframeJs\/uiconf_id\/([0-9]+)\/partner_id\/([0-9]+)(.*)entry_id.([a-zA-Z0-9-_].*)$/;
const MATCH_URL_NICONICO = /(?:www\.|)?nicovideo\.jp\/watch\/(\w+)$/;
export const AUDIO_EXTENSIONS =
	/\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
export const VIDEO_EXTENSIONS =
	/\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;
export const DASH_EXTENSIONS = /\.(mpd)($|\?)/i;
export const FLV_EXTENSIONS = /\.(flv)($|\?)/i;

abstract class VideoService {
	protected constructor(readonly type: PlayerType) {}

	abstract canPlay(url: string): boolean;

	abstract extractVideoId(url: string): string | undefined;
}

class AudioVideoService extends VideoService {
	constructor() {
		super('Audio');
	}

	canPlay(url: string): boolean {
		return AUDIO_EXTENSIONS.test(url) || VIDEO_EXTENSIONS.test(url);
	}

	extractVideoId(url: string): string | undefined {
		return url;
	}
}

class DailymotionVideoService extends VideoService {
	constructor() {
		super('Dailymotion');
	}

	canPlay(url: string): boolean {
		return MATCH_URL_DAILYMOTION.test(url);
	}

	extractVideoId(url: string): string | undefined {
		const matches = MATCH_URL_DAILYMOTION.exec(url);
		return matches?.[1];
	}
}

class NiconicoVideoService extends VideoService {
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

class SoundCloudVideoService extends VideoService {
	constructor() {
		super('SoundCloud');
	}

	canPlay(url: string): boolean {
		return MATCH_URL_SOUNDCLOUD.test(url);
	}

	extractVideoId(url: string): string | undefined {
		return url;
	}
}

class TwitchVideoService extends VideoService {
	constructor() {
		super('Twitch');
	}

	canPlay(url: string): boolean {
		return MATCH_URL_TWITCH_VIDEO.test(url);
	}

	extractVideoId(url: string): string | undefined {
		const matches = MATCH_URL_TWITCH_VIDEO.exec(url);
		return matches?.[1];
	}
}

class VimeoVideoService extends VideoService {
	constructor() {
		super('Vimeo');
	}

	canPlay(url: string): boolean {
		return MATCH_URL_VIMEO.test(url);
	}

	extractVideoId(url: string): string | undefined {
		return MATCH_URL_VIMEO.exec(url)?.[1];
	}
}

class YouTubeVideoService extends VideoService {
	constructor() {
		super('YouTube');
	}

	canPlay(url: string): boolean {
		return MATCH_URL_YOUTUBE.test(url);
	}

	extractVideoId(url: string): string | undefined {
		const matches = MATCH_URL_YOUTUBE.exec(url);
		return matches?.[1];
	}
}

export const videoServices = [
	new AudioVideoService(),
	new DailymotionVideoService(),
	new NiconicoVideoService(),
	new SoundCloudVideoService(),
	new TwitchVideoService(),
	new VimeoVideoService(),
	new YouTubeVideoService(),
];
