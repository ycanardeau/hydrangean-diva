import type { ILogger } from '@/controllers/Logger';
import { type Mock, vi } from 'vitest';

export function createTestLogger(): ILogger & { log: Mock<ILogger['log']> } {
	return {
		isEnabled: () => true,
		log: vi.fn<ILogger['log']>(),
	};
}
