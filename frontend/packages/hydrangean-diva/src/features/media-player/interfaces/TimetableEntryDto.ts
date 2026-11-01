import type { JSONSchemaType } from 'ajv';

export interface TimetableEntryDto {
	readonly seconds: number;
	readonly title: string;
}

export const TimetableEntryDtoSchema: JSONSchemaType<TimetableEntryDto> = {
	type: 'object',
	properties: {
		seconds: {
			type: 'number',
		},
		title: {
			type: 'string',
		},
	},
	required: ['seconds', 'title'],
};
