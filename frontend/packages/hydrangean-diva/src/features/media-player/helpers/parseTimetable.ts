import type { TimetableEntryDto } from '@/features/media-player/interfaces/TimetableEntryDto';

// Matches `m:ss`, `mm:ss`, `h:mm:ss` and `hh:mm:ss`.
const timestampPattern = /(?<!\d)(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?!\d)/g;

// Characters commonly used to separate a timestamp from a title, e.g. `0:00 - Song`.
const separatorPattern = /^[\s\-–—~|:.・]+|[\s\-–—~|:・]+$/g;

function toSeconds(
	hours: string | undefined,
	minutes: string,
	seconds: string,
): number | undefined {
	const h = hours !== undefined ? Number(hours) : 0;
	const m = Number(minutes);
	const s = Number(seconds);

	if (s >= 60 || (hours !== undefined && m >= 60)) {
		return undefined;
	}

	return h * 3600 + m * 60 + s;
}

function parseLine(line: string): TimetableEntryDto | undefined {
	const matches = [...line.matchAll(timestampPattern)];
	const firstMatch = matches.at(0);
	if (firstMatch === undefined) {
		return undefined;
	}

	const seconds = toSeconds(firstMatch[1], firstMatch[2], firstMatch[3]);
	if (seconds === undefined) {
		return undefined;
	}

	// Remove every timestamp so that ranges like `0:00 - 3:00 Song` keep only the title.
	const title = line
		.replace(timestampPattern, '')
		.replace(/[([]\s*[)\]]/g, '')
		.replace(separatorPattern, '')
		.replace(/\s+/g, ' ')
		.trim();

	return { seconds, title };
}

/**
 * Extracts a timetable (e.g. `0:00 Song 1`, `3:00 Song 2`) from a video description.
 * Returns an empty array when fewer than two timestamped lines are found,
 * so that a single stray time in the text is not mistaken for a timetable.
 */
export function parseTimetable(text: string): TimetableEntryDto[] {
	const entries = text
		.split(/\r?\n/)
		.map(parseLine)
		.filter((entry) => entry !== undefined);

	if (entries.length < 2) {
		return [];
	}

	return entries.sort((a, b) => a.seconds - b.seconds);
}

export function formatTimetableTime(totalSeconds: number): string {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.floor(totalSeconds % 60);

	const ss = seconds.toString().padStart(2, '0');
	return hours > 0
		? `${hours}:${minutes.toString().padStart(2, '0')}:${ss}`
		: `${minutes}:${ss}`;
}

export function stringifyTimetable(entries: TimetableEntryDto[]): string {
	return entries
		.map((entry) => `${formatTimetableTime(entry.seconds)} ${entry.title}`)
		.join('\n');
}
