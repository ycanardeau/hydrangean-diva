import { PlayerControllerImpl } from '@/controllers/PlayerControllerImpl';

// https://developer.spotify.com/documentation/embeds/references/iframe-api
export class SpotifyPlayerController extends PlayerControllerImpl<Spotify.EmbedController> {
	// The Spotify iframe API has no getters for the duration or the current
	// position, so cache the latest values reported by `playback_update` (both
	// in milliseconds).
	private duration = 0;
	private position = 0;

	// Spotify has no dedicated play/pause events, so derive them from `isPaused`
	// transitions in `playback_update`.
	private previousIsPaused = true;

	// Spotify has no `ended` event and reports the end of a track repeatedly,
	// including after the next track has been requested. Track the URI the embed
	// is currently playing so a stale end update (still tagged with the previous
	// track) cannot fire `onEnded` again and skip the next track.
	private currentUri: string | undefined;
	private ended = false;

	private handlePlaybackUpdate = (e: {
		data: Spotify.PlaybackUpdateData;
	}): void => {
		const { position, duration, isPaused, playingURI } = e.data;

		// A different URI means the embed has moved on to another track, so any
		// pending end state from the previous track no longer applies.
		if (playingURI !== this.currentUri) {
			this.currentUri = playingURI;
			this.ended = false;
		}

		this.position = position;
		this.duration = duration;

		this.options?.onTimeUpdate?.({
			duration: duration / 1000,
			percent: duration > 0 ? position / duration : 0,
			seconds: position / 1000,
		});

		if (isPaused !== this.previousIsPaused) {
			this.previousIsPaused = isPaused;

			if (isPaused) {
				this.options?.onPause?.();
			} else {
				this.options?.onPlay?.();
			}
		}

		// Spotify has no `ended` event. When a track finishes, `position` reaches
		// `duration` (with `isPaused` staying false) and updates then stop, so
		// emit `onEnded` once at that point. Reset when playback moves back from
		// the end (e.g. repeat-one, which restarts the track) so it can fire
		// again on the next playthrough.
		if (duration > 0 && position >= duration) {
			if (!this.ended) {
				this.ended = true;
				this.options?.onEnded?.();
			}
		} else {
			this.ended = false;
		}
	};

	async attach(id: string): Promise<void> {
		// Fire `onLoaded` only once the embed is `ready`. The host app autoplays
		// by calling `play` from its `onLoaded` handler, and the embed silently
		// drops playback commands issued before it is ready.
		this.player.addListener('ready', () =>
			this.options?.onLoaded?.({ id: id }),
		);
		this.player.addListener('playback_update', this.handlePlaybackUpdate);
	}

	async detach(): Promise<void> {
		// `removeListener` is unreliable in the Spotify iframe API, but the
		// embed (and thus its listeners) is torn down when React unmounts the
		// host element, so there is nothing to clean up here.
	}

	async loadVideo(id: string): Promise<void> {
		this.duration = 0;
		this.position = 0;
		this.previousIsPaused = true;
		// `ended` is intentionally not reset here: the previous track's final
		// update can still arrive after this call, and resetting would let it
		// fire `onEnded` again. It is reset once the embed reports the new URI.

		this.player.loadUri(id);

		this.options?.onLoaded?.({ id: id });
	}

	async play(): Promise<void> {
		// `resume` both starts and resumes playback, unlike `play`.
		this.player.resume();
	}

	async pause(): Promise<void> {
		this.player.pause();
	}

	async setCurrentTime(seconds: number): Promise<void> {
		// The Spotify embed ignores `seek(0)`, so use the dedicated `restart`
		// method to return to the beginning of the track.
		if (seconds <= 0) {
			this.player.restart();
		} else {
			this.player.seek(seconds);
		}
	}

	setVolume = undefined;

	setMuted = undefined;

	setPlaybackRate = undefined;

	async getDuration(): Promise<number> {
		return this.duration / 1000;
	}

	async getCurrentTime(): Promise<number> {
		return this.position / 1000;
	}

	getVolume = undefined;

	getMuted = undefined;

	getPlaybackRate = undefined;
}
