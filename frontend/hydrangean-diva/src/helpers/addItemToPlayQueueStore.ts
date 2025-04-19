import { isNoembedResult } from '@/helpers/isNoembedResult';
import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { findVideoService } from '@aigamo/nostalgic-diva';

export async function addItemToPlayQueueStore(
	playQueueStore: PlayQueueStore,
	{ url, title }: { url: string; title: string },
): Promise<boolean> {
	const videoService = findVideoService(url);
	if (videoService === undefined) {
		return false;
	}

	const videoId = videoService.extractVideoId(url);
	if (videoId === undefined) {
		return false;
	}

	const response = await fetch(
		`https://noembed.com/embed?url=${encodeURIComponent(url)}`,
	);
	const jsonData = await response.json();

	await playQueueStore.addItems([
		playQueueStore.createItem({
			url: url,
			type: videoService.type,
			videoId: videoId,
			title:
				title || (isNoembedResult(jsonData) ? jsonData.title : videoId),
		}),
	]);

	return true;
}
