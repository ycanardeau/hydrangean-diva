import { AudioVideoService } from '@/services/AudioVideoService';
import { DailymotionVideoService } from '@/services/DailymotionVideoService';
import { NiconicoVideoService } from '@/services/NiconicoVideoService';
import { SoundCloudVideoService } from '@/services/SoundCloudVideoService';
import { TwitchVideoService } from '@/services/TwitchVideoService';
import type { VideoService } from '@/services/VideoService';
import { VimeoVideoService } from '@/services/VimeoVideoService';
import { YouTubeVideoService } from '@/services/YouTubeVideoService';

export const videoServices: VideoService[] = [
	new YouTubeVideoService(),
	new TwitchVideoService(),
	new VimeoVideoService(),
	new DailymotionVideoService(),
	new SoundCloudVideoService(),
	new AudioVideoService(),
	new NiconicoVideoService(),
];

export function findVideoService(url: string): VideoService | undefined {
	return videoServices.find((videoService) => videoService.canPlay(url));
}
