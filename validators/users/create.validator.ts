import { ApiEvent } from "@octopy/serverless-aws";
import { JSONSchemaType } from "ajv";
import { DataSource } from "typeorm";
// import { User } from '../../entities/user.entity';

export interface ICreateUsersValidator {
    name: string;
    email: string;
    password: string;
}

export const CreateUsersValidator: JSONSchemaType<ICreateUsersValidator> = {
    type: "object",
    properties: {
        name: {
            type: "string",
        },
        email: {
            type: "string",
        },
        password: {
            type: "string",
        }
    },
    required: ["name", "email", "password"],
    additionalProperties: false
}

export const findUser = async (event: ApiEvent<ICreateUsersValidator>,db: DataSource) => {
    // return db.createQueryBuilder()
    //         .select("email")
    //         .from(User, 'user')
    //         .where("user.email = :email", {event.body.email})
    //         .getOne();
}