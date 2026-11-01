interface YouTubeVideoListResponse {
	items: { snippet: { description: string } }[];
}

interface YouTubeCommentThreadListResponse {
	items: {
		snippet: {
			topLevelComment: {
				snippet: { textOriginal: string; likeCount: number };
			};
		};
	}[];
}

interface YouTubeErrorResponse {
	error: {
		message: string;
		errors?: { reason?: string }[];
	};
}

export interface YouTubeComment {
	readonly text: string;
	readonly likeCount: number;
}

function hasItems(value: any): value is { items: unknown[] } {
	return (
		value !== null &&
		typeof value === 'object' &&
		Array.isArray(value.items)
	);
}

function isYouTubeErrorResponse(value: any): value is YouTubeErrorResponse {
	return (
		value !== null &&
		typeof value === 'object' &&
		typeof value.error?.message === 'string'
	);
}

class YouTubeDataApiError extends Error {
	constructor(
		message: string,
		readonly reason: string | undefined,
	) {
		super(message);
	}
}

async function get(
	path: string,
	params: Record<string, string>,
	apiKey: string,
	signal?: AbortSignal,
): Promise<{ items: unknown[] }> {
	const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
	for (const [name, value] of Object.entries(params)) {
		url.searchParams.set(name, value);
	}

	const response = await fetch(url, {
		// Pass the key in a header rather than the query string to keep it out of URLs and logs.
		headers: { 'X-Goog-Api-Key': apiKey },
		signal,
	});
	const jsonData: unknown = await response.json();

	if (!response.ok) {
		if (isYouTubeErrorResponse(jsonData)) {
			const reason = jsonData.error.errors?.at(0)?.reason;
			if (reason === 'quotaExceeded') {
				throw new YouTubeDataApiError(
					'The daily quota of your YouTube Data API key has been exceeded. It resets at midnight Pacific Time.' /* LOC */,
					reason,
				);
			}

			throw new YouTubeDataApiError(jsonData.error.message, reason);
		}

		throw new YouTubeDataApiError(
			`YouTube Data API request failed (${response.status}).`,
			undefined,
		);
	}

	if (!hasItems(jsonData)) {
		throw new Error('Unexpected response from YouTube Data API.');
	}

	return jsonData;
}

/**
 * Fetches the description of a YouTube video with the YouTube Data API.
 * Costs 1 unit of the API key's daily quota.
 * Returns `undefined` when the video does not exist.
 */
export async function fetchYouTubeVideoDescription(
	videoId: string,
	apiKey: string,
	signal?: AbortSignal,
): Promise<string | undefined> {
	const jsonData = (await get(
		'videos',
		{ part: 'snippet', id: videoId },
		apiKey,
		signal,
	)) as YouTubeVideoListResponse;

	return jsonData.items.at(0)?.snippet.description;
}

/**
 * Fetches up to 100 of the most relevant top-level comments of a YouTube video with the YouTube Data API.
 * Costs 1 unit of the API key's daily quota.
 * Returns an empty array when comments are disabled.
 */
export async function fetchYouTubeTopComments(
	videoId: string,
	apiKey: string,
	signal?: AbortSignal,
): Promise<YouTubeComment[]> {
	try {
		const jsonData = (await get(
			'commentThreads',
			{
				part: 'snippet',
				videoId: videoId,
				order: 'relevance',
				maxResults: '100',
				textFormat: 'plainText',
			},
			apiKey,
			signal,
		)) as YouTubeCommentThreadListResponse;

		return jsonData.items.map((item) => ({
			text: item.snippet.topLevelComment.snippet.textOriginal,
			likeCount: item.snippet.topLevelComment.snippet.likeCount,
		}));
	} catch (error) {
		if (
			error instanceof YouTubeDataApiError &&
			error.reason === 'commentsDisabled'
		) {
			return [];
		}

		throw error;
	}
}
