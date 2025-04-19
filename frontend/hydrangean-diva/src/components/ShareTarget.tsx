import { addItemToPlayQueueStore } from '@/helpers/addItemToPlayQueueStore';
import { PlayQueueStore } from '@/stores/PlayQueueStore';
import { ReactElement, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ShareTargetProps {
	playQueueStore: PlayQueueStore;
}

export const ShareTarget = ({
	playQueueStore,
}: ShareTargetProps): ReactElement => {
	const { search } = useLocation();
	const searchParams = new URLSearchParams(search.slice(1));
	const url = searchParams.get('url') ?? '';
	const title = searchParams.get('title') ?? '';

	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			await addItemToPlayQueueStore(playQueueStore, { url, title });

			navigate('/', { replace: true });
		})();
	}, []);

	return <></>;
};
