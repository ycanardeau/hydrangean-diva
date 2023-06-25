import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';

const ajv = new Ajv({
	coerceTypes: true,
});

export function getOrAddSchema<T>(
	schema: JSONSchemaType<T>,
	keyRef: string,
): ValidateFunction<T> {
	// https://ajv.js.org/guide/managing-schemas.html#pre-adding-all-schemas-vs-adding-on-demand
	let validate: ValidateFunction<T> | undefined;
	validate = ajv.getSchema(keyRef);
	if (validate === undefined) {
		ajv.addSchema(schema, keyRef);
		validate = ajv.getSchema(keyRef);
	}

	if (validate === undefined || validate.schema !== schema) {
		throw new Error(
			`Invalid schema. Expected: '${JSON.stringify(
				schema,
			)}', but got '${JSON.stringify(validate?.schema)}'.`,
		);
	}

	return validate;
}
