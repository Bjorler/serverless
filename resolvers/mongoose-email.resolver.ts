import { Use, Interceptor, BodyParser, Permissions, Validate, PrintError, TokenPayload } from "@octopy/serverless-core";
import { Mongoose, ConnectionHelper, BaseSchemaModel } from "@octopy/serverless-mongoose";
import { ApiEvent as AwsApiEvent } from "@octopy/serverless-aws";
import { createTransport, Transporter, hbsTemplate } from "@octopy/serverless-nodemailer";
import es from '@translations/es.json';

export type MongooseDb = Mongoose;
export type BaseModel = BaseSchemaModel;
export type ApiEvent<T = any> = AwsApiEvent<T>;
export type Mailer = Transporter;
export const Template = hbsTemplate;

export interface Options {
    schemas?: Array<any[]>
    uri?: string,
    permissions?: string[],
    validate?: Object,
    template?: string
}

export const MongooseEmailResolver = (
    handler: (event: any, db: Mongoose, mailer: any) => any,
    options?: Options
) => {
    const instance = async (event: any, db: Mongoose, mailer: any, context?: any) => {
        db = await ConnectionHelper(options?.uri ?? process.env.MONGOOSE_URI);

        if (options?.schemas) {
            options.schemas.forEach(item => {
                const [collection, schema] = item;
                db.models[collection] = db.model(collection, schema);
            });
        }

        mailer = createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            from: `"${ process.env.EMAIL_SENDERS_NAME }" <${ process.env.EMAIL_USER }>`
        });

        const tp = Template('templates');

        mailer.use('compile', tp);

        return handler(event, db, mailer);
    }

    return Use(instance)
        .use(Permissions(options?.permissions))
        .use(BodyParser())
        .use(Validate(options?.validate))
        .use(TokenPayload())
        .use(PrintError(es))
        .use(Interceptor());
}