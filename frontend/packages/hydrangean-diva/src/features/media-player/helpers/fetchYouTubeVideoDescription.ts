interface YouTubeVideoListResponse {
	items: { snippet: { description: string } }[];
}

interface YouTubeErrorResponse {
	error: {
		message: string;
		errors?: { reason?: string }[];
	};
}

function isYouTubeVideoListResponse(
	value: any,
): value is YouTubeVideoListResponse {
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
	const url = new URL('https://www.googleapis.com/youtube/v3/videos');
	url.searchParams.set('part', 'snippet');
	url.searchParams.set('id', videoId);

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
				throw new Error(
					'The daily quota of your YouTube Data API key has been exceeded. It resets at midnight Pacific Time.' /* LOC */,
				);
			}

			throw new Error(jsonData.error.message);
		}

		throw new Error(
			`YouTube Data API request failed (${response.status}).`,
		);
	}

	if (!isYouTubeVideoListResponse(jsonData)) {
		throw new Error('Unexpected response from YouTube Data API.');
	}

	return jsonData.items.at(0)?.snippet.description;
}
