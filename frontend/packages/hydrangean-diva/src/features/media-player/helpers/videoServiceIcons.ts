import type { PlayerType } from '@aigamo/nostalgic-diva';

export const videoServiceIcons: Map<PlayerType, string> = new Map(
	Object.entries({
		Audio: '' /* TODO */,
		Dailymotion: 'https://www.dailymotion.com/favicon.ico',
		Niconico: 'https://www.nicovideo.jp/favicon.ico',
		SoundCloud: 'https://soundcloud.com/favicon.ico',
		Spotify:
			'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png',
		Twitch: 'https://www.twitch.tv/favicon.ico',
		Vimeo: 'https://vimeo.com/favicon.ico',
		YouTube: 'https://www.youtube.com/favicon.ico',
	}),
);
