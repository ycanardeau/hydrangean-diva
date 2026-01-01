import { PlayerControllerImpl } from '@/controllers/PlayerControllerImpl';

// https://github.com/VocaDB/vocadb/blob/61b8c54f3eca906a477101dab4fdd9b154be310e/VocaDbWeb/Scripts/ViewModels/PVs/PVPlayerFile.ts.
export class AudioPlayerController extends PlayerControllerImpl<HTMLAudioElement> {
	async attach(): Promise<void> {
		this.player.onerror = (event): void => this.options?.onError?.(event);
		this.player.onloadeddata = (): void =>
			this.options?.onLoaded?.({ id: this.player.src });
		this.player.onplay = (): void => this.options?.onPlay?.();
		this.player.onpause = (): void => this.options?.onPause?.();
		this.player.onended = (): void => this.options?.onEnded?.();
		this.player.ontimeupdate = (): void => {
			this.options?.onTimeUpdate?.({
				duration: this.player.duration,
				percent: this.player.currentTime / this.player.duration,
				seconds: this.player.currentTime,
			});
		};
	}

	async detach(): Promise<void> {
		this.player.onerror = null;
		this.player.onloadeddata = null;
		this.player.onplay = null;
		this.player.onpause = null;
		this.player.onended = null;
		this.player.ontimeupdate = null;
	}

	async loadVideo(id: string): Promise<void> {
		this.player.src = id;
	}

	async play(): Promise<void> {
		await this.player.play();
	}

	async pause(): Promise<void> {
		this.player.pause();
	}

	async setCurrentTime(seconds: number): Promise<void> {
		this.player.currentTime = seconds;
	}

	async setVolume(volume: number): Promise<void> {
		this.player.volume = volume;
	}

	async setMuted(muted: boolean): Promise<void> {
		this.player.muted = muted;
	}

	async setPlaybackRate(playbackRate: number): Promise<void> {
		this.player.playbackRate = playbackRate;
	}

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

	async getPlaybackRate(): Promise<number> {
		return this.player.playbackRate;
	}
}
