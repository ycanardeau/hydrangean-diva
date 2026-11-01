import { SettingsContext } from '@/features/media-player/contexts/SettingsContext';
import { SettingsStore } from '@/features/media-player/stores/SettingsStore';
import { localStorageStateKeys } from '@/shared/stores/localStorageStateKeys';
import { useLocalStorageState } from '@aigamo/route-sphere';
import { type ReactElement, type ReactNode, useState } from 'react';

interface SettingsProviderProps {
	children?: ReactNode;
}

export const SettingsProvider = ({
	children,
}: SettingsProviderProps): ReactElement => {
	const [settings] = useState(() => new SettingsStore());

	useLocalStorageState(
		localStorageStateKeys.settings,
		settings.localStorageState,
	);

	return (
		<SettingsContext.Provider value={settings}>
			{children}
		</SettingsContext.Provider>
	);
};
