import type { IPlayQueueItemStore } from '@/features/media-player/interfaces/IPlayQueueItemStore';
import type { TimetableEntryDto } from '@/features/media-player/interfaces/TimetableEntryDto';

export interface ITimetableStore {
	readonly currentItem: IPlayQueueItemStore | undefined;
	readonly entries: TimetableEntryDto[] | undefined;
	readonly currentEntryIndex: number | undefined;
	readonly loading: boolean;
	readonly error: string | undefined;
	readonly canFetch: boolean;
	readonly canEdit: boolean;
	readonly canSeek: boolean;
	fetch(): Promise<void>;
	setText(text: string): void;
	seekTo(entry: TimetableEntryDto): Promise<void>;
	startAutoFetch(): () => void;
}
