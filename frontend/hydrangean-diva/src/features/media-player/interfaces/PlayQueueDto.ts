import { JSONSchemaType } from 'ajv';

import { RepeatMode } from '@/features/media-player/interfaces/RepeatMode';
import {
	PlayQueueItemDto,
	PlayQueueItemDtoSchema,
} from '@/features/media-player/interfaces/PlayQueueItemDto';

export interface PlayQueueDto {
	version?: '1.0';
	repeat?: RepeatMode;
	shuffle?: boolean;
	items?: PlayQueueItemDto[];
	currentIndex?: number;
}

export const PlayQueueDtoSchema: JSONSchemaType<PlayQueueDto> = {
	type: 'object',
	properties: {
		version: {
			type: 'string',
			nullable: true,
		},
		repeat: {
			type: 'string',
			enum: Object.values(RepeatMode),
			nullable: true,
		},
		shuffle: {
			type: 'boolean',
			nullable: true,
		},
		items: {
			type: 'array',
			nullable: true,
			items: PlayQueueItemDtoSchema,
		},
		currentIndex: {
			type: 'integer',
			nullable: true,
		},
	},
};
