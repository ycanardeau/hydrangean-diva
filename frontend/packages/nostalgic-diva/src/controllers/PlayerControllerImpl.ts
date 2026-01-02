import { type ILogger, LogLevel } from '@/controllers/Logger';
import type {
	IPlayerCommands,
	PlayerOptions,
} from '@/controllers/PlayerController';

export abstract class PlayerControllerImpl<TPlayer>
	implements Partial<IPlayerCommands>
{
	constructor(
		protected readonly logger: ILogger,
		protected readonly player: TPlayer,
		protected readonly options: PlayerOptions | undefined,
	) {
		this.logger.log(LogLevel.Debug, 'ctor');
	}

	abstract attach(id: string): Promise<void>;
	abstract detach(): Promise<void>;
	abstract loadVideo?(id: string): Promise<void>;
	abstract play?(): Promise<void>;
	abstract pause?(): Promise<void>;
	abstract setCurrentTime?(seconds: number): Promise<void>;
	abstract setVolume?(volume: number): Promise<void>;
	abstract setMuted?(muted: boolean): Promise<void>;
	abstract setPlaybackRate?(playbackRate: number): Promise<void>;
	abstract getDuration?(): Promise<number>;
	abstract getCurrentTime?(): Promise<number>;
	abstract getVolume?(): Promise<number>;
	abstract getMuted?(): Promise<boolean>;
	abstract getPlaybackRate?(): Promise<number>;

	supports(command: keyof IPlayerCommands): boolean {
		return this[command] !== undefined;
	}
}
