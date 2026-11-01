import type { ISettingsStore } from '@/features/media-player/interfaces/ISettingsStore';
import { getOrAddSchema } from '@/shared/stores/getOrAddSchema';
import type { IStateStore } from '@aigamo/route-sphere';
import type { JSONSchemaType } from 'ajv';
import { action, computed, makeObservable, observable } from 'mobx';

interface SettingsLocalStorageState {
	youTubeApiKey?: string;
}

export const SettingsLocalStorageStateSchema: JSONSchemaType<SettingsLocalStorageState> =
	{
		type: 'object',
		properties: {
			youTubeApiKey: {
				type: 'string',
				nullable: true,
			},
		},
	};

class SettingsLocalStorageStateStore implements IStateStore<SettingsLocalStorageState> {
	constructor(private readonly settings: SettingsStore) {
		makeObservable(this);
	}

	@computed.struct get state(): SettingsLocalStorageState {
		return {
			youTubeApiKey: this.settings.youTubeApiKey || undefined,
		};
	}
	set state(value: SettingsLocalStorageState) {
		this.settings.youTubeApiKey = value.youTubeApiKey ?? '';
	}

	validateState(state: unknown): state is SettingsLocalStorageState {
		return getOrAddSchema(
			SettingsLocalStorageStateSchema,
			'SettingsLocalStorageState',
		)(state);
	}
}

export class SettingsStore implements ISettingsStore {
	readonly localStorageState: SettingsLocalStorageStateStore;
	@observable youTubeApiKey = '';

	constructor() {
		makeObservable(this);

		this.localStorageState = new SettingsLocalStorageStateStore(this);
	}

	@computed get hasYouTubeApiKey(): boolean {
		return this.youTubeApiKey.length > 0;
	}

	@action.bound setYouTubeApiKey(value: string): void {
		this.youTubeApiKey = value.trim();
	}
}
