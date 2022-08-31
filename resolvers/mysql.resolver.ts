import { Use, Interceptor, BodyParser, Permissions, Validate, PrintError, TokenPayload } from "@octopy/serverless-core";
import { DataSource, getMetadataArgsStorage } from 'typeorm';
import { ApiEvent as AwsApiEvent } from "@octopy/serverless-aws";
import es from '@translations/es.json';


export type MySQLDB = DataSource;
export type ApiEvent<T = any> = AwsApiEvent<T>;


export interface Options {
    schemas?: Array<any[]>
    uri?: string,
    permissions?: string[],
    validate?: Object 
}

export const MySQLResolver = (
    handler: (event: any, db: DataSource) => any,
    options?: Options
) => {
    const instance = async(event: any, db: DataSource, context?: any) => {
        // db = await ConnectionHelper(options?.uri ?? process.env.MONGOOSE_URI);

        db = new DataSource({
            type: "mysql",
            host: process.env.SQL_HOST,
            port: Number (process.env.SQL_PORT),
            username: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DB,
            // entities: [__dirname + "../entities/*.entity.{js,ts}"],
            entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
            synchronize: true,
            logging: false,
        })

        await db.initialize();

        // if(options?.schemas) {
        //     options.schemas.forEach(async item => {
        //         const [collection, schema] = item;
        //         // db.models[collection] = db.model(collection, schema);
        //     });
        // }
        
        
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