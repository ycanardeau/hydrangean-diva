import type { PlayerType } from '@aigamo/nostalgic-diva';
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
import type { ReactElement } from 'react';

type ThirdPartyPlayerType = Exclude<PlayerType, 'Audio'>;

const domainNames: Record<ThirdPartyPlayerType, string> = {
	Dailymotion: 'dailymotion.com',
	Niconico: 'nicovideo.jp',
	SoundCloud: 'soundcloud.com',
	Twitch: 'twitch.tv',
	Vimeo: 'vimeo.com',
	YouTube: 'youtube.com',
};

const termsOfServiceUrls: Record<ThirdPartyPlayerType, string> = {
	Dailymotion: 'https://legal.dailymotion.com/en/terms-of-use/',
	Niconico: 'https://account.nicovideo.jp/rules/account?language=en-us',
	SoundCloud: 'https://soundcloud.com/terms-of-use',
	Twitch: 'https://legal.twitch.com/legal/terms-of-service/',
	Vimeo: 'https://vimeo.com/terms/',
	YouTube: 'https://www.youtube.com/t/terms',
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
