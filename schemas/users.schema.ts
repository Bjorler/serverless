import { BaseSchema } from "@octopy/serverless-mongoose";

export interface IUsers {
    name: string;

    email: string;

    password: string;
}

const schema = new BaseSchema<IUsers>({
    name:  {
        type: String,
    },

    email: {
        type: String,
    },

    password: {
        type: String,
    }
});

export const usersSchema = ['users', schema];