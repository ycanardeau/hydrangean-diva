import {
	NostalgicDivaProvider,
	NostalgicDivaProviderProps,
} from '@aigamo/nostalgic-diva';
import { ReactElement } from 'react';

export type HydrangeanDivaProviderProps = NostalgicDivaProviderProps;

export const HydrangeanDivaProvider = (
	props: HydrangeanDivaProviderProps,
): ReactElement => {
	return <NostalgicDivaProvider {...props} />;
};
