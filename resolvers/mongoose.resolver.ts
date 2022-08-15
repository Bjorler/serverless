import { Use, Interceptor, BodyParser, Permissions, Validate, PrintError, TokenPayload } from "@octopy/serverless-core";
import { Mongoose, ConnectionHelper, BaseSchemaModel } from "@octopy/serverless-mongoose";
import { ApiEvent as AwsApiEvent } from "@octopy/serverless-aws";
import es from '@translations/es.json';

export type MongooseDb = Mongoose;
export type BaseModel = BaseSchemaModel;
export type ApiEvent<T = any> = AwsApiEvent<T>;

export interface Options {
    schemas?: Array<any[]>
    uri?: string,
    permissions?: string[],
    validate?: Object 
}

export const MongooseResolver = (
    handler: (event: any, db: Mongoose) => any,
    options?: Options
) => {
    const instance = async(event: any, db:Mongoose, context?: any) => {
        db = await ConnectionHelper(options?.uri ?? process.env.MONGOOSE_URI);

        if(options?.schemas) {
            options.schemas.forEach(item => {
                const [collection, schema] = item;
                db.models[collection] = db.model(collection, schema);
            });
        }
        
        return handler(event, db);
    }

    return Use(instance)
        .use(TokenPayload())
        .use(Permissions(options?.permissions))
        .use(BodyParser())
        .use(Validate(options?.validate))
        .use(PrintError(es))
        .use(Interceptor());
}