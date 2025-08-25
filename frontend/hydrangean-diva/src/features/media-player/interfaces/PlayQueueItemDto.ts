import { PlayerType } from '@aigamo/nostalgic-diva';
import { JSONSchemaType } from 'ajv';

export interface PlayQueueItemDto {
	readonly url: string;
	readonly type: PlayerType;
	readonly videoId: string;
	readonly title: string;
}

export const PlayQueueItemDtoSchema: JSONSchemaType<PlayQueueItemDto> = {
	type: 'object',
	properties: {
		url: {
			type: 'string',
		},
		type: {
			type: 'string',
		},
		videoId: {
			type: 'string',
		},
		title: {
			type: 'string',
		},
	},
	required: ['url', 'type', 'videoId', 'title'],
};
