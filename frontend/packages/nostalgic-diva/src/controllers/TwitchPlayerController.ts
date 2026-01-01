import { PlayerControllerImpl } from '@/controllers/PlayerControllerImpl';

export class TwitchPlayerController extends PlayerControllerImpl<Twitch.Player> {
	private handleReady = (): void => {
		this.options?.onLoaded?.({ id: this.player.getVideo() });
	};

	private handlePlay = (): void => {
		this.options?.onPlay?.();
	};

	private handlePause = (): void => {
		this.options?.onPause?.();
	};

	private handleEnded = (): void => {
		this.options?.onEnded?.();
	};

	private handleSeek = (): void => {
		this.options?.onTimeUpdate?.({
			duration: 0,
			percent: 0,
			seconds: 0,
		});
	};

	async attach(_id: string): Promise<void> {
		this.player.addEventListener(Twitch.Player.READY, this.handleReady);
		this.player.addEventListener(Twitch.Player.PLAYING, this.handlePlay);
		this.player.addEventListener(Twitch.Player.PAUSE, this.handlePause);
		this.player.addEventListener(Twitch.Player.ENDED, this.handleEnded);
		this.player.addEventListener(Twitch.Player.SEEK, this.handleSeek);
	}

	async detach(): Promise<void> {}

	async loadVideo(id: string): Promise<void> {
		this.player.setVideo(id, 0);
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
		return this.player.getDuration();
	}

	async getCurrentTime(): Promise<number> {
		return this.player.getCurrentTime();
	}

	async getVolume(): Promise<number> {
		return this.player.getVolume();
	}

	async getMuted(): Promise<boolean> {
		return this.player.getMuted();
	}

	getPlaybackRate = undefined;
}
