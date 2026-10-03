import usePreviousDistinct from '@/components/usePreviousDistinct';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { render } from '../render';

describe('usePreviousDistinct', () => {
	it('should track the previous distinct value', async () => {
		const results: (string | undefined)[] = [];

		function Probe({ value }: { value: string }): ReactElement {
			results.push(usePreviousDistinct(value));
			return <></>;
		}

		const { rerender } = await render(<Probe value="a" />);
		await rerender(<Probe value="a" />);
		await rerender(<Probe value="b" />);
		await rerender(<Probe value="b" />);
		await rerender(<Probe value="c" />);

		expect(results).toEqual([undefined, undefined, 'a', 'a', 'b']);
	});
});
