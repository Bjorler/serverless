import { Mongoose, ConnectionHelper, BaseSchemaModel } from "@octopy/serverless-mongoose";
import { Use, BodyParser, Interceptor, Permissions, Validate, PrintError, TokenPayload } from "@octopy/serverless-core";
import { S3Helper as S3Instance, ApiEvent as AwsApiEvent } from "@octopy/serverless-aws";
import es from '@translations/es.json';

export type MongooseDb = Mongoose;
export type BaseModel = BaseSchemaModel;
export type ApiEvent<T = any> = AwsApiEvent<T>;
export type S3Helper = S3Instance;

export interface Options {
    schemas?: Array<any[]>
    uri?: string
    permissions?: string[],
    validate?: Object 
    s3_id?: string
    s3_key?: string
    s3_region?: string
}

export const MongooseS3Resolver = (
    handler: (event: any, db: Mongoose, s3: S3Helper) => any,
    options?: Options
) => {
    const instance = async(event: any, db: Mongoose, s3: S3Helper, context?: any) => {
        db = await ConnectionHelper(options?.uri ?? process.env.MONGOOSE_URI);

        if(options?.schemas) {
            options.schemas.forEach(item => {
                const [collection, schema] = item;
                db.models[collection] = db.model(collection, schema);
            });
        }

        s3 = new S3Instance({
            accessKeyId: options?.s3_id ?? process.env.S3_ID,
            secretAccessKey: options?.s3_key ?? process.env.S3_KEY,
            region: options?.s3_region ?? process.env.S3_REGION
        });

        return handler(event, db, s3)
    }

    return Use(instance)
        .use(TokenPayload())
        .use(Permissions(options?.permissions))
        .use(BodyParser())
        .use(Validate(options?.validate))
        .use(PrintError(es))
        .use(Interceptor());
}