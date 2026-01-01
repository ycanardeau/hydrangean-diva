// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
import { ICON_TYPES } from '@elastic/eui';
import { icon as apps } from '@elastic/eui/es/components/icon/assets/apps';
import { icon as arrowLeft } from '@elastic/eui/es/components/icon/assets/arrow_left';
import { icon as arrowRight } from '@elastic/eui/es/components/icon/assets/arrow_right';
import { icon as check } from '@elastic/eui/es/components/icon/assets/check';
import { icon as copyClipboard } from '@elastic/eui/es/components/icon/assets/copy_clipboard';
import { icon as cross } from '@elastic/eui/es/components/icon/assets/cross';
import { icon as empty } from '@elastic/eui/es/components/icon/assets/empty';
import { icon as fullScreenExit } from '@elastic/eui/es/components/icon/assets/fullScreenExit';
import { icon as fullScreen } from '@elastic/eui/es/components/icon/assets/full_screen';
import { icon as logoGithub } from '@elastic/eui/es/components/icon/assets/logo_github';
import { icon as menu } from '@elastic/eui/es/components/icon/assets/menu';
import { icon as popout } from '@elastic/eui/es/components/icon/assets/popout';
import { icon as returnKey } from '@elastic/eui/es/components/icon/assets/return_key';
import { icon as search } from '@elastic/eui/es/components/icon/assets/search';
import { icon as stopFilled } from '@elastic/eui/es/components/icon/assets/stop_filled';
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';
import type { ValuesType } from 'utility-types';

type IconComponentNameType = ValuesType<typeof ICON_TYPES>;
type IconComponentCacheType = Partial<Record<IconComponentNameType, unknown>>;

const cachedIcons: IconComponentCacheType = {
	apps,
	arrowLeft,
	arrowRight,
	check,
	copyClipboard,
	cross,
	empty,
	fullScreen,
	fullScreenExit,
	logoGithub,
	menu,
	popout,
	returnKey,
	search,
	stopFilled,
};

appendIconComponentCache(cachedIcons);
