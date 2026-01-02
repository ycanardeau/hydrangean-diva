import { type ILogger, LogLevel } from '@/controllers/Logger';
import { PlayerControllerImpl } from '@/controllers/PlayerControllerImpl';

export enum PlayerType {
	'Audio' = 'Audio',
	'Dailymotion' = 'Dailymotion',
	'Niconico' = 'Niconico',
	'SoundCloud' = 'SoundCloud',
	'Twitch' = 'Twitch',
	'Vimeo' = 'Vimeo',
	'YouTube' = 'YouTube',
}

export function validatePlayerType(value: string): value is PlayerType {
	return PlayerType[value as keyof typeof PlayerType] !== undefined;
}

export interface LoadedEvent {
	id: string;
}

export interface TimeEvent {
	duration: number;
	percent: number;
	seconds: number;
}

export interface PlayerOptions {
	onError?(event: any): void;
	onLoaded?(event: LoadedEvent): void;
	onPlay?(): void;
	onPause?(): void;
	onEnded?(): void;
	onTimeUpdate?(event: TimeEvent): void;
}

export interface IPlayerCommands {
	loadVideo(id: string): Promise<void>;
	play(): Promise<void>;
	pause(): Promise<void>;
	setCurrentTime(seconds: number): Promise<void>;
	setVolume(volume: number): Promise<void>;
	setMuted(muted: boolean): Promise<void>;
	setPlaybackRate(playbackRate: number): Promise<void>;
	getDuration(): Promise<number>;
	getCurrentTime(): Promise<number>;
	getVolume(): Promise<number>;
	getMuted(): Promise<boolean>;
	getPlaybackRate(): Promise<number>;
}

export interface IPlayerController extends IPlayerCommands {
	supports(command: keyof IPlayerCommands): boolean;
}

export class PlayerController<
	TPlayer extends object,
	TController extends PlayerControllerImpl<TPlayer>,
> implements IPlayerController
{
	private static nextId = 1;

	private readonly id: number;
	private impl?: TController;

	constructor(
		private readonly logger: ILogger,
		private readonly type: PlayerType,
		private readonly player: TPlayer,
		private readonly options: PlayerOptions | undefined,
		private readonly controllerFactory: new (
			logger: ILogger,
			player: TPlayer,
			options: PlayerOptions | undefined,
		) => TController,
	) {
		this.id = PlayerController.nextId++;
	}

	private createMessage(message: any): string {
		return `${this.type}#${this.id} ${message}`;
	}

	public debug(message?: any, ...optionalParams: any): void {
		this.logger.log(
			LogLevel.Debug,
			this.createMessage(message),
			...optionalParams,
		);
	}

	public error(message?: any, ...optionalParams: any): void {
		this.logger.log(
			LogLevel.Error,
			this.createMessage(message),
			...optionalParams,
		);
	}

	async attach(id: string): Promise<void> {
		this.debug('attach', id);

		if (this.impl) {
			this.debug('player is already attached');
			return;
		}

		this.debug('Attaching player...');

		this.impl = new this.controllerFactory(
			this.logger,
			this.player,
			this.options,
		);

		await this.impl.attach(id);

		this.debug('player attached');
	}

	private createPlayerNotAttachedError(): Error {
		return new Error('player is not attached');
	}

	private createCommandNotSupportedError(
		command: keyof IPlayerCommands,
	): Error {
		return new Error(`${command} is not supported`);
	}

	async detach(): Promise<void> {
		this.debug('detach');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		await this.impl.detach();

		this.impl = undefined;
	}

	async loadVideo(id: string): Promise<void> {
		this.debug('loadVideo', id);

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.loadVideo === undefined) {
			throw this.createCommandNotSupportedError('loadVideo');
		}

		this.debug('Loading video...');

		await this.impl.loadVideo(id);

		this.debug('video loaded', id);
	}

	play(): Promise<void> {
		this.debug('play');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.play === undefined) {
			throw this.createCommandNotSupportedError('play');
		}

		return this.impl.play();
	}

	pause(): Promise<void> {
		this.debug('pause');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.pause === undefined) {
			throw this.createCommandNotSupportedError('pause');
		}

		return this.impl.pause();
	}

	setCurrentTime(seconds: number): Promise<void> {
		this.debug('setCurrentTime', seconds);

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.setCurrentTime === undefined) {
			throw this.createCommandNotSupportedError('setCurrentTime');
		}

		return this.impl.setCurrentTime(seconds);
	}

	setVolume(volume: number): Promise<void> {
		this.debug('setVolume', volume);

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.setVolume === undefined) {
			throw this.createCommandNotSupportedError('setVolume');
		}

		return this.impl.setVolume(volume);
	}

	setMuted(muted: boolean): Promise<void> {
		this.debug('setMuted', muted);

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.setMuted === undefined) {
			throw this.createCommandNotSupportedError('setMuted');
		}

		return this.impl.setMuted(muted);
	}

	setPlaybackRate(playbackRate: number): Promise<void> {
		this.debug('setPlaybackRate', playbackRate);

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.setPlaybackRate === undefined) {
			throw this.createCommandNotSupportedError('setPlaybackRate');
		}

		return this.impl.setPlaybackRate(playbackRate);
	}

	getDuration(): Promise<number> {
		this.debug('getDuration');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.getDuration === undefined) {
			throw this.createCommandNotSupportedError('getDuration');
		}

		return this.impl.getDuration();
	}

	getCurrentTime(): Promise<number> {
		this.debug('getCurrentTime');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.getCurrentTime === undefined) {
			throw this.createCommandNotSupportedError('getCurrentTime');
		}

		return this.impl.getCurrentTime();
	}

	getVolume(): Promise<number> {
		this.debug('getVolume');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.getVolume === undefined) {
			throw this.createCommandNotSupportedError('getVolume');
		}

		return this.impl.getVolume();
	}

	getMuted(): Promise<boolean> {
		this.debug('getMuted');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.getMuted === undefined) {
			throw this.createCommandNotSupportedError('getMuted');
		}

		return this.impl.getMuted();
	}

	getPlaybackRate(): Promise<number> {
		this.debug('getPlaybackRate');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		if (this.impl.getPlaybackRate === undefined) {
			throw this.createCommandNotSupportedError('getPlaybackRate');
		}

		return this.impl.getPlaybackRate();
	}

	supports(command: keyof IPlayerCommands): boolean {
		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		return this.impl.supports(command);
	}
}
