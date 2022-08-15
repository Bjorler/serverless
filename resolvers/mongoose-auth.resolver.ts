import { Mongoose, ConnectionHelper, BaseSchemaModel } from "@octopy/serverless-mongoose";
import { APIGatewayTokenAuthorizerEvent, generatePolicy } from "@octopy/serverless-aws-lambda";
import { tokenizer } from "@octopy/serverless-jsonwebtoken";

export type MongooseDb = Mongoose;
export type BaseModel = BaseSchemaModel;
export type ApiAuthEvent = APIGatewayTokenAuthorizerEvent;
export const GeneratePolicy = generatePolicy;
export const Tokenizer = tokenizer;

export interface Options {
    schemas?: Array<any[]>
    uri?: string,
}

export const MongooseAuthResolver = (
    handler: (event: any, db: Mongoose) => any,
    options?: Options
) => {
    const instance = async(event: any, db:Mongoose, context?: any) => {
        db = await ConnectionHelper(options?.uri ?? process.env.MONGOOSE_URI);
        
        if(options?.schemas) {
            options.schemas.forEach(schema => {
                db.models[schema[0]] ?? db.model(schema[0], schema[1])
            });
        }

        return handler(event, db);
    }

    return instance;
}