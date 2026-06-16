interface NoembedResult {
	title: string;
}

export function isNoembedResult(value: any): value is NoembedResult {
	return (
		value !== null &&
		typeof value === 'object' &&
		'title' in value &&
		typeof value.title === 'string'
	);
}
