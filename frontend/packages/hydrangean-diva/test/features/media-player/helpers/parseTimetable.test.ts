import {
	formatTimetableTime,
	parseTimetable,
	stringifyTimetable,
} from '@/features/media-player/helpers/parseTimetable';
import { describe, expect, it } from 'vitest';

describe('parseTimetable', () => {
	it('should parse timestamps at the start of lines', () => {
		expect(parseTimetable('0:00 Song 1\n3:00 Song 2')).toEqual([
			{ seconds: 0, title: 'Song 1' },
			{ seconds: 180, title: 'Song 2' },
		]);
	});

	it('should parse timestamps at the end of lines', () => {
		expect(parseTimetable('Song 1 0:00\nSong 2 3:00')).toEqual([
			{ seconds: 0, title: 'Song 1' },
			{ seconds: 180, title: 'Song 2' },
		]);
	});

	it('should parse hours', () => {
		expect(parseTimetable('00:00 Song 1\n1:02:03 Song 2')).toEqual([
			{ seconds: 0, title: 'Song 1' },
			{ seconds: 3723, title: 'Song 2' },
		]);
	});

	it('should strip separators and brackets', () => {
		expect(
			parseTimetable(
				'[0:00] - Song 1\n(3:00) | Song 2\n6:00 : Song 3\n9:00 ・ Song 4',
			),
		).toEqual([
			{ seconds: 0, title: 'Song 1' },
			{ seconds: 180, title: 'Song 2' },
			{ seconds: 360, title: 'Song 3' },
			{ seconds: 540, title: 'Song 4' },
		]);
	});

	it('should use the start of a time range', () => {
		expect(
			parseTimetable('0:00 - 3:00 Song 1\n3:00 - 6:00 Song 2'),
		).toEqual([
			{ seconds: 0, title: 'Song 1' },
			{ seconds: 180, title: 'Song 2' },
		]);
	});

	it('should ignore lines without timestamps', () => {
		expect(
			parseTimetable(
				'Setlist:\n\n0:00 Song 1\nhttps://example.com\n3:00 Song 2\n',
			),
		).toEqual([
			{ seconds: 0, title: 'Song 1' },
			{ seconds: 180, title: 'Song 2' },
		]);
	});

	it('should handle CRLF line endings', () => {
		expect(parseTimetable('0:00 Song 1\r\n3:00 Song 2')).toEqual([
			{ seconds: 0, title: 'Song 1' },
			{ seconds: 180, title: 'Song 2' },
		]);
	});

	it('should sort entries by time', () => {
		expect(parseTimetable('3:00 Song 2\n0:00 Song 1')).toEqual([
			{ seconds: 0, title: 'Song 1' },
			{ seconds: 180, title: 'Song 2' },
		]);
	});

	it('should ignore invalid times', () => {
		expect(
			parseTimetable('0:00 Song 1\n3:75 Song 2\n1:60:00 Song 3'),
		).toEqual([]);
	});

	it('should return an empty array when there is only one timestamp', () => {
		expect(parseTimetable('Live at 12:30 on Saturday')).toEqual([]);
	});

	it('should return an empty array for empty text', () => {
		expect(parseTimetable('')).toEqual([]);
	});
});

describe('formatTimetableTime', () => {
	it('should format minutes and seconds', () => {
		expect(formatTimetableTime(0)).toBe('0:00');
		expect(formatTimetableTime(185)).toBe('3:05');
	});

	it('should format hours', () => {
		expect(formatTimetableTime(3723)).toBe('1:02:03');
	});
});

describe('stringifyTimetable', () => {
	it('should round-trip with parseTimetable', () => {
		const text = '0:00 Song 1\n3:00 Song 2\n1:02:03 Song 3';

		expect(stringifyTimetable(parseTimetable(text))).toBe(text);
	});
});
