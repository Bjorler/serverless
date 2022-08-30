import { JSONSchemaType } from "ajv";

export interface IUpdateUsersValidator {
    name: string;
    email: string;
    password: string;
}

export const UpdateUsersValidator: JSONSchemaType<IUpdateUsersValidator> = {
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 1,
        },
        email: {
            type: "string",
            minLength: 1,
        },
        password: {
            type: "string",
            minLength: 1,
        }
    },
    required: [],
    additionalProperties: false
}