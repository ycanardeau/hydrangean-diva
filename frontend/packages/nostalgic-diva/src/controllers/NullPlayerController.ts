import type {
	IPlayerCommands,
	IPlayerController,
} from '@/controllers/PlayerController';

class NullPlayerController implements IPlayerController {
	async attach(): Promise<void> {}

	async detach(): Promise<void> {}

	async loadVideo(_id: string): Promise<void> {}

	async play(): Promise<void> {}

	async pause(): Promise<void> {}

	async setCurrentTime(_seconds: number): Promise<void> {}

	async setVolume(_volume: number): Promise<void> {}

	async setMuted(_muted: boolean): Promise<void> {}

	async setPlaybackRate(_playbackRate: number): Promise<void> {}

	async getDuration(): Promise<number> {
		return 0;
	}

	async getCurrentTime(): Promise<number> {
		return 0;
	}

	async getVolume(): Promise<number> {
		return 0;
	}

	async getMuted(): Promise<boolean> {
		return false;
	}

	async getPlaybackRate(): Promise<number> {
		return 0;
	}

	supports(_command: keyof IPlayerCommands): boolean {
		return false;
	}
}

export const nullPlayerController = new NullPlayerController();
