// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
import { ICON_TYPES } from '@elastic/eui';
import { icon as apps } from '@elastic/eui/es/components/icon/assets/apps';
import { icon as arrowLeft } from '@elastic/eui/es/components/icon/assets/arrow_left';
import { icon as arrowRight } from '@elastic/eui/es/components/icon/assets/arrow_right';
import { icon as check } from '@elastic/eui/es/components/icon/assets/check';
import { icon as cross } from '@elastic/eui/es/components/icon/assets/cross';
import { icon as empty } from '@elastic/eui/es/components/icon/assets/empty';
import { icon as menu } from '@elastic/eui/es/components/icon/assets/menu';
import { icon as popout } from '@elastic/eui/es/components/icon/assets/popout';
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';
import { ValuesType } from 'utility-types';

type IconComponentNameType = ValuesType<typeof ICON_TYPES>;
type IconComponentCacheType = Partial<Record<IconComponentNameType, unknown>>;

const cachedIcons: IconComponentCacheType = {
	apps,
	arrowLeft,
	arrowRight,
	check,
	cross,
	empty,
	menu,
	popout,
};

appendIconComponentCache(cachedIcons);
