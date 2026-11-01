export interface ISettingsStore {
	readonly youTubeApiKey: string;
	readonly hasYouTubeApiKey: boolean;
	setYouTubeApiKey(value: string): void;
}
