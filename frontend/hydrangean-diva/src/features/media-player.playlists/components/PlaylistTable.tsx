import { videoServiceIcons } from '@/features/common/helpers/videoServiceIcons';
import { PlaylistStore } from '@/features/media-player.playlists/stores/PlaylistStore';
import { useNostalgicDiva } from '@aigamo/nostalgic-diva';
import { EuiBasicTable, EuiButton, EuiLink } from '@elastic/eui';
import { PlayRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import { ReactElement } from 'react';

interface PlaylistTableProps {
	playlistStore: PlaylistStore;
}

export const PlaylistTable = observer(
	({ playlistStore }: PlaylistTableProps): ReactElement => {
		const diva = useNostalgicDiva();

		return (
			<EuiBasicTable
				responsiveBreakpoint={false}
				items={playlistStore.items}
				rowHeader="name"
				columns={[
					{
						name: '',
						field: 'type',
						render: (_, item) => (
							<img
								src={videoServiceIcons[item.type]}
								width={16}
								height={16}
								alt={item.type /* TODO */}
							/>
						),
						textOnly: false,
						width: '24px',
					},
					{
						name: 'Title' /* LOC */,
						field: 'title',
						render: (_, item) => (
							<EuiLink
								href={item.url}
								target="_blank"
								external
								onClick={(): Promise<void> => diva.pause()}
							>
								{item.title}
							</EuiLink>
						),
					},
					{
						name: '',
						field: '',
						render: (_, item) => (
							<>
								<EuiButton
									iconType={PlayRegular}
									size="s"
									onClick={async (): Promise<void> => {
										// TODO: implement
									}}
								>
									Play{/* LOC */}
								</EuiButton>
							</>
						),
						textOnly: true,
						align: 'right',
					},
				]}
				rowProps={{}}
				cellProps={{}}
				loading={playlistStore.loading}
				selection={{}}
			/>
		);
	},
);
