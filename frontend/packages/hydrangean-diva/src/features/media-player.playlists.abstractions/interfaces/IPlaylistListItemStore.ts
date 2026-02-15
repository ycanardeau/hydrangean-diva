export interface IPlaylistListItemStore {
	readonly id: string;
	readonly name: string;
	rename(name: string): Promise<void>;
	remove(): Promise<void>;
}
