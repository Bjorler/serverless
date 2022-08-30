import { BaseSchema, Schema } from "@octopy/serverless-mongoose"

export interface ISession {
    //user_id: string
    email: string
    token: string
    created: Date
}

const schema = new BaseSchema<ISession>({
    /*user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },*/
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: new Date(),
        expires: process.env.TOKEN_EXPIRES_IN
    }
});

export const sessionSchema = ['session', schema];