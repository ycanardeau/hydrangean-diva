import { JSONSchemaType } from 'ajv';

import { getOrAddSchema } from '@/features/media-player/stores/getOrAddSchema';
import { PlayQueueItemDto } from '@/features/media-player/stores/IPlayQueueItemStore';
import { RepeatMode } from '@/features/media-player/stores/RepeatMode';

export interface PlayQueueLocalStorageState {
	version?: '1.0';
	repeat?: RepeatMode;
	shuffle?: boolean;
	items?: PlayQueueItemDto[];
	currentIndex?: number;
}

const PlayQueueLocalStorageStateSchema: JSONSchemaType<PlayQueueLocalStorageState> =
	{
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
				items: {
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
				},
			},
			currentIndex: {
				type: 'integer',
				nullable: true,
			},
		},
	};

export const validatePlayQueueLocalStorageState = getOrAddSchema(
	PlayQueueLocalStorageStateSchema,
	'PlayQueueStore',
);
