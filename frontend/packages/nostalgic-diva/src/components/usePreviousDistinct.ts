// https://github.com/streamich/react-use/blob/8ceb4c0f0c5625124f487b435a2fd0d3b3bc2a4f/src/usePreviousDistinct.ts.
import { useFirstMountState } from '@/components/useFirstMountState';
import { useRef } from 'react';

export type Predicate<T> = (prev: T | undefined, next: T) => boolean;

const strictEquals = <T>(prev: T | undefined, next: T): boolean =>
	prev === next;

export default function usePreviousDistinct<T>(
	value: T,
	compare: Predicate<T> = strictEquals,
): T | undefined {
	const prevRef = useRef<T>();
	const curRef = useRef<T>(value);
	const isFirstMount = useFirstMountState();

	if (!isFirstMount && !compare(curRef.current, value)) {
		prevRef.current = curRef.current;
		curRef.current = value;
	}

	return prevRef.current;
}
