import { PlayerType } from '@aigamo/nostalgic-diva';
import {
	EuiButton,
	EuiButtonEmpty,
	EuiFlexGroup,
	EuiFlexItem,
	EuiLink,
	EuiPanel,
	EuiText,
} from '@elastic/eui';
import { PlayRegular } from '@fluentui/react-icons';
import { ReactElement } from 'react';

type ThirdPartyPlayerType = Exclude<PlayerType, PlayerType.Audio>;

const domainNames: Record<ThirdPartyPlayerType, string> = {
	[PlayerType.Dailymotion]: 'dailymotion.com',
	[PlayerType.Niconico]: 'nicovideo.jp',
	[PlayerType.SoundCloud]: 'soundcloud.com',
	[PlayerType.Twitch]: 'twitch.tv',
	[PlayerType.Vimeo]: 'vimeo.com',
	[PlayerType.YouTube]: 'youtube.com',
};

const termsOfServiceUrls: Record<ThirdPartyPlayerType, string> = {
	[PlayerType.Dailymotion]: 'https://legal.dailymotion.com/en/terms-of-use/',
	[PlayerType.Niconico]:
		'https://account.nicovideo.jp/rules/account?language=en-us',
	[PlayerType.SoundCloud]: 'https://soundcloud.com/terms-of-use',
	[PlayerType.Twitch]: 'https://legal.twitch.com/legal/terms-of-service/',
	[PlayerType.Vimeo]: 'https://vimeo.com/terms/',
	[PlayerType.YouTube]: 'https://www.youtube.com/t/terms',
};

interface CookieConsentPanelProps {
	playerType: ThirdPartyPlayerType;
}

export const CookieConsentPanel = ({
	playerType,
}: CookieConsentPanelProps): ReactElement => {
	return (
		<EuiPanel
			paddingSize="l"
			style={{ textAlign: 'center', height: '100%' }}
		>
			<EuiFlexGroup
				direction="column"
				alignItems="center"
				gutterSize="m"
				justifyContent="center"
				css={{ height: '100%' }}
			>
				<EuiFlexItem grow={false}>
					<EuiText>
						<p>
							This content is hosted by a third party. By showing
							the external content you accept the{' '}
							<EuiLink
								href={termsOfServiceUrls[playerType]}
								target="_blank"
							>
								terms and conditions
							</EuiLink>{' '}
							of {domainNames[playerType]}.{/* LOC */}
						</p>
					</EuiText>
				</EuiFlexItem>

				<EuiFlexItem grow={false}>
					<EuiFlexGroup gutterSize="s">
						<EuiButton fill iconType={PlayRegular}>
							Load video{/* LOC */}
						</EuiButton>
						<EuiButtonEmpty>
							Don't ask again{/* LOC */}
						</EuiButtonEmpty>
					</EuiFlexGroup>
				</EuiFlexItem>
			</EuiFlexGroup>
		</EuiPanel>
	);
};
