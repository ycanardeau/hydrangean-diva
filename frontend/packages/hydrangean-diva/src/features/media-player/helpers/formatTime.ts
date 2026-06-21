export const formatTime = (totalSeconds: number): string => {
	if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
		totalSeconds = 0;
	}

	const seconds = Math.floor(totalSeconds % 60);
	const minutes = Math.floor((totalSeconds / 60) % 60);
	const hours = Math.floor(totalSeconds / 3600);

	const pad = (value: number): string => value.toString().padStart(2, '0');

	return hours > 0
		? `${hours}:${pad(minutes)}:${pad(seconds)}`
		: `${minutes}:${pad(seconds)}`;
};
