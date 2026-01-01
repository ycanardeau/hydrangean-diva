import { AudioVideoService } from '@/services/AudioVideoService';
import { DailymotionVideoService } from '@/services/DailymotionVideoService';
import { NiconicoVideoService } from '@/services/NiconicoVideoService';
import { SoundCloudVideoService } from '@/services/SoundCloudVideoService';
import { TwitchVideoService } from '@/services/TwitchVideoService';
import { VimeoVideoService } from '@/services/VimeoVideoService';
import { YouTubeVideoService } from '@/services/YouTubeVideoService';

const videoServices = [
	new AudioVideoService(),
	new DailymotionVideoService(),
	new NiconicoVideoService(),
	new SoundCloudVideoService(),
	new TwitchVideoService(),
	new VimeoVideoService(),
	new YouTubeVideoService(),
] as const;

export function findVideoService(
	url: string,
): (typeof videoServices)[number] | undefined {
	return videoServices.find((videoService) => videoService.canPlay(url));
}
