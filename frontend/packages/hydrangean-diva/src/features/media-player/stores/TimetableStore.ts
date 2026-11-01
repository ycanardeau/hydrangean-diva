import { fetchYouTubeVideoDescription } from '@/features/media-player/helpers/fetchYouTubeVideoDescription';
import { parseTimetable } from '@/features/media-player/helpers/parseTimetable';
import type { IPlayQueueItemStore } from '@/features/media-player/interfaces/IPlayQueueItemStore';
import type { IPlayQueueStore } from '@/features/media-player/interfaces/IPlayQueueStore';
import type { IPlayerStore } from '@/features/media-player/interfaces/IPlayerStore';
import type { ISettingsStore } from '@/features/media-player/interfaces/ISettingsStore';
import type { ITimetableStore } from '@/features/media-player/interfaces/ITimetableStore';
import {
	type TimetableEntryDto,
	TimetableEntryDtoSchema,
} from '@/features/media-player/interfaces/TimetableEntryDto';
import { getOrAddSchema } from '@/shared/stores/getOrAddSchema';
import type { IStateStore } from '@aigamo/route-sphere';
import type { JSONSchemaType } from 'ajv';
import {
	action,
	comparer,
	computed,
	makeObservable,
	observable,
	reaction,
	runInAction,
} from 'mobx';

interface TimetableLocalStorageState {
	version?: '1.0';
	// Keyed by `${type}/${videoId}`. An empty array means that the video has no timetable.
	timetables?: Record<string, TimetableEntryDto[]>;
}

export const TimetableLocalStorageStateSchema: JSONSchemaType<TimetableLocalStorageState> =
	{
		type: 'object',
		properties: {
			version: {
				type: 'string',
				nullable: true,
			},
			timetables: {
				type: 'object',
				nullable: true,
				required: [],
				additionalProperties: {
					type: 'array',
					items: TimetableEntryDtoSchema,
				},
			},
		},
	};

class TimetableLocalStorageStateStore implements IStateStore<TimetableLocalStorageState> {
	constructor(private readonly timetable: TimetableStore) {
		makeObservable(this);
	}

	@computed.struct get state(): TimetableLocalStorageState {
		return {
			version: '1.0',
			timetables: Object.fromEntries(this.timetable.timetables),
		};
	}
	set state(value: TimetableLocalStorageState) {
		this.timetable.timetables.replace(value.timetables ?? {});
	}

	validateState(state: unknown): state is TimetableLocalStorageState {
		return getOrAddSchema(
			TimetableLocalStorageStateSchema,
			'TimetableLocalStorageState',
		)(state);
	}
}

function getKey(item: IPlayQueueItemStore): string {
	return `${item.type}/${item.videoId}`;
}

export class TimetableStore implements ITimetableStore {
	readonly localStorageState: TimetableLocalStorageStateStore;
	readonly timetables = observable.map<string, TimetableEntryDto[]>();
	// The video for which `loading` and `error` apply.
	@observable private statusKey: string | undefined;
	@observable private statusLoading = false;
	@observable private statusError: string | undefined;

	constructor(
		private readonly player: IPlayerStore,
		private readonly playQueue: IPlayQueueStore,
		private readonly settings: ISettingsStore,
		private readonly fetchDescription = fetchYouTubeVideoDescription,
	) {
		makeObservable(this);

		this.localStorageState = new TimetableLocalStorageStateStore(this);
	}

	@computed get currentItem(): IPlayQueueItemStore | undefined {
		return this.playQueue.currentItem;
	}

	@computed private get currentKey(): string | undefined {
		return this.currentItem !== undefined
			? getKey(this.currentItem)
			: undefined;
	}

	@computed get entries(): TimetableEntryDto[] | undefined {
		return this.currentKey !== undefined
			? this.timetables.get(this.currentKey)
			: undefined;
	}

	@computed get currentEntryIndex(): number | undefined {
		if (this.entries === undefined) {
			return undefined;
		}

		// Entries are sorted by time, so the current one is the last that has started.
		for (let index = this.entries.length - 1; index >= 0; index--) {
			if (this.entries[index].seconds <= this.player.seconds) {
				return index;
			}
		}

		return undefined;
	}

	@computed get loading(): boolean {
		return this.statusKey === this.currentKey && this.statusLoading;
	}

	@computed get error(): string | undefined {
		return this.statusKey === this.currentKey
			? this.statusError
			: undefined;
	}

	@computed get canFetch(): boolean {
		return (
			this.currentItem?.type === 'YouTube' &&
			this.settings.hasYouTubeApiKey &&
			!this.loading
		);
	}

	@computed get canEdit(): boolean {
		return this.currentItem !== undefined;
	}

	@computed get canSeek(): boolean {
		return this.player.controller.supports('setCurrentTime');
	}

	@action.bound async fetch(): Promise<void> {
		const item = this.currentItem;
		if (item === undefined || !this.canFetch) {
			return;
		}

		const key = getKey(item);

		this.statusKey = key;
		this.statusLoading = true;
		this.statusError = undefined;

		try {
			const description = await this.fetchDescription(
				item.videoId,
				this.settings.youTubeApiKey,
			);

			runInAction(() => {
				this.timetables.set(key, parseTimetable(description ?? ''));
			});
		} catch (error) {
			runInAction(() => {
				if (this.statusKey === key) {
					this.statusError =
						error instanceof Error ? error.message : String(error);
				}
			});
		} finally {
			runInAction(() => {
				if (this.statusKey === key) {
					this.statusLoading = false;
				}
			});
		}
	}

	@action.bound setText(text: string): void {
		if (this.currentKey === undefined) {
			return;
		}

		this.timetables.set(this.currentKey, parseTimetable(text));

		if (this.statusKey === this.currentKey) {
			this.statusError = undefined;
		}
	}

	@action.bound async seekTo(entry: TimetableEntryDto): Promise<void> {
		await this.player.controller.setCurrentTime(entry.seconds);
	}

	/**
	 * Fetches the timetable of the current video once, when it has not been fetched yet.
	 * Returns a function that stops watching the current video.
	 */
	startAutoFetch(): () => void {
		return reaction(
			() => ({
				key: this.currentKey,
				shouldFetch:
					this.canFetch &&
					this.entries === undefined &&
					this.statusKey !== this.currentKey,
			}),
			async ({ shouldFetch }) => {
				if (shouldFetch) {
					await this.fetch();
				}
			},
			{ fireImmediately: true, equals: comparer.structural },
		);
	}
}
