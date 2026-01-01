import { PlayerControllerImpl } from '@/controllers/PlayerControllerImpl';

const events = [
	'apiready',
	'seeked',
	'video_end',
	'durationchange',
	'pause',
	'playing',
	'error',
] satisfies DM.EventType[];

export class DailymotionPlayerController extends PlayerControllerImpl<DM.player> {
	private handlePlayerEvents = (e: { type: DM.EventType }): void => {
		switch (e.type) {
			case 'apiready':
				this.options?.onLoaded?.({ id: this.player.video.videoId });
				break;
			case 'seeked':
				this.options?.onTimeUpdate?.({
					duration: this.player.duration,
					percent: this.player.currentTime / this.player.duration,
					seconds: this.player.currentTime,
				});
				break;
			case 'video_end':
				this.options?.onEnded?.();
				break;
			case 'durationchange':
				break;
			case 'pause':
				this.options?.onPause?.();
				break;
			case 'playing':
				this.options?.onPlay?.();
				break;
			case 'error':
				this.options?.onError?.(e);
				break;
		}
	};

	async attach(_id: string): Promise<void> {
		for (const event of events) {
			this.player.addEventListener(event, this.handlePlayerEvents);
		}
	}

	async detach(): Promise<void> {
		for (const event of events) {
			this.player.removeEventListener(event, this.handlePlayerEvents);
		}
	}

	async loadVideo(id: string): Promise<void> {
		this.player.load(id);
	}

	async play(): Promise<void> {
		this.player.play();
	}

	async pause(): Promise<void> {
		this.player.pause();
	}

	async setCurrentTime(seconds: number): Promise<void> {
		this.player.seek(seconds);
	}

	async setVolume(volume: number): Promise<void> {
		this.player.setVolume(volume);
	}

	async setMuted(muted: boolean): Promise<void> {
		this.player.setMuted(muted);
	}

	setPlaybackRate = undefined;

	async getDuration(): Promise<number> {
		return this.player.duration;
	}

	async getCurrentTime(): Promise<number> {
		return this.player.currentTime;
	}

	async getVolume(): Promise<number> {
		return this.player.volume;
	}

	async getMuted(): Promise<boolean> {
		return this.player.muted;
	}

	getPlaybackRate = undefined;
}
