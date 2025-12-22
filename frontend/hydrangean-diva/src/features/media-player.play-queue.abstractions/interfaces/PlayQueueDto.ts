import {
	PlayQueueItemDto,
	PlayQueueItemDtoSchema,
} from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { RepeatMode } from '@/features/media-player.play-queue.abstractions/interfaces/RepeatMode';
import { JSONSchemaType } from 'ajv';

export interface PlayQueueDto {
	readonly version?: '1.0';
	readonly repeat?: RepeatMode;
	readonly shuffle?: boolean;
	readonly items?: PlayQueueItemDto[];
	readonly currentIndex?: number;
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
