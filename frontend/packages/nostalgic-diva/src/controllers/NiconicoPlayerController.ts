import { LogLevel } from '@/controllers/Logger';
import { PlayerControllerImpl } from '@/controllers/PlayerControllerImpl';

declare global {
	interface Window {
		onNicoPlayerFactoryReady: (callback: nico.NicoPlayerFactory) => void;
	}
}

enum PlayerStatus {
	Play = 2,
	Pause = 3,
	End = 4,
}

// https://github.com/VocaDB/vocadb/blob/a4b5f9d8186772d7e6f58f997bbcbb51509d2539/VocaDbWeb/Scripts/ViewModels/PVs/PVPlayerNico.ts.
export class NiconicoPlayerController extends PlayerControllerImpl<HTMLIFrameElement> {
	private static readonly origin = 'https://embed.nicovideo.jp';

	private duration = 0;
	private currentTime = 0;
	private volume = 0;
	private muted = false;

	private handleMessage = (e: nico.PlayerEvent): void => {
		if (e.origin !== NiconicoPlayerController.origin) return;

		const data = e.data;

		switch (data.eventName) {
			case 'playerStatusChange':
				this.logger.log(
					LogLevel.Debug,
					`player status changed: ${
						PlayerStatus[data.data.playerStatus] ??
						data.data.playerStatus
					}`,
				);
				break;

			case 'statusChange':
				this.logger.log(
					LogLevel.Debug,
					`status changed: ${
						PlayerStatus[data.data.playerStatus] ??
						data.data.playerStatus
					}`,
				);

				switch (data.data.playerStatus) {
					case PlayerStatus.Play:
						this.options?.onPlay?.();
						break;

					case PlayerStatus.Pause:
						this.options?.onPause?.();
						break;

					case PlayerStatus.End:
						this.options?.onEnded?.();
						break;
				}
				break;

			case 'playerMetadataChange':
				if (data.data.duration !== undefined)
					this.duration = data.data.duration / 1000;

				this.currentTime =
					data.data.currentTime === undefined
						? 0
						: data.data.currentTime / 1000;

				this.volume = data.data.volume;
				this.muted = data.data.muted;

				this.options?.onTimeUpdate?.({
					duration: this.duration,
					percent:
						this.currentTime !== 0 && this.duration !== 0
							? this.currentTime / this.duration
							: 0,
					seconds: this.currentTime,
				});
				break;

			case 'loadComplete':
				this.logger.log(LogLevel.Debug, 'load completed');

				this.duration = data.data.videoInfo.lengthInSeconds;

				this.options?.onLoaded?.({ id: data.data.videoInfo.watchId });
				break;

			case 'error':
				// TODO: Implement.

				this.options?.onError?.(data);
				break;

			case 'player-error:video:play':
			case 'player-error:video:seek':
				this.options?.onError?.(data);
				break;

			default:
				this.logger.log(
					LogLevel.Debug,
					'message',
					(data as any).eventName,
					(data as any).data,
				);
				break;
		}
	};

	async attach(): Promise<void> {
		window.addEventListener('message', this.handleMessage);
	}

	async detach(): Promise<void> {
		window.removeEventListener('message', this.handleMessage);
	}

	async loadVideo(id: string): Promise<void> {
		return new Promise((resolve, _reject /* TODO: Reject. */) => {
			this.duration = 0;
			this.currentTime = 0;
			this.volume = 0;
			this.muted = false;

			// Wait for iframe to load.
			this.player.onload = (): void => {
				this.player.onload = null;
				resolve();
			};

			this.player.src = `https://embed.nicovideo.jp/watch/${id}?jsapi=1&playerId=1`;
		});
	}

	// https://blog.hayu.io/web/create/nicovideo-embed-player-api/.
	private postMessage(message: any): void {
		this.player.contentWindow?.postMessage(
			{
				...message,
				playerId: '1' /* Needs to be a string, not a number. */,
				sourceConnectorType: 1,
			},
			NiconicoPlayerController.origin,
		);
	}

	async play(): Promise<void> {
		this.postMessage({ eventName: 'play' });
	}

	async pause(): Promise<void> {
		this.postMessage({ eventName: 'pause' });
	}

	async setCurrentTime(seconds: number): Promise<void> {
		this.postMessage({ eventName: 'seek', data: { time: seconds * 1000 } });
	}

	async setVolume(volume: number): Promise<void> {
		this.postMessage({
			eventName: 'volumeChange',
			data: { volume: volume },
		});
	}

	async setMuted(muted: boolean): Promise<void> {
		this.postMessage({
			eventName: 'mute',
			data: { mute: muted },
		});
	}

	setPlaybackRate = undefined;

	async getDuration(): Promise<number> {
		return this.duration;
	}

	async getCurrentTime(): Promise<number> {
		return this.currentTime;
	}

	async getVolume(): Promise<number> {
		return this.volume;
	}

	async getMuted(): Promise<boolean> {
		return this.muted;
	}

	getPlaybackRate = undefined;
}
