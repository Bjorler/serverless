import { Mongoose, ConnectionHelper } from "@octopy/serverless-mongoose";
import { Use, Interceptor } from "@octopy/serverless-core";
import { ApiSocket as AwsApiSocket, ApiGatewayManagementApi } from "@octopy/serverless-aws";
import { APIGatewayProxyEvent } from "@octopy/serverless-aws-lambda";

export type MongooseDb = Mongoose;
export type ApiEvent = APIGatewayProxyEvent;
export type ApiSocket<T> = AwsApiSocket<T>;

export interface Options {
    schemas?: Array<any[]>
    uri?: string
}

export const MongooseSocketResolver = (
    handler: (event: any, db: Mongoose, socket: any) => any,
    options?: Options
) => {
    const instance = async(event: any, db:Mongoose, socket: any, context?: any) => {

        let body = {};
        if(event.body) {
            body = JSON.parse(event.body);
        }
        
        socket = {
            connectionId: event.requestContext?.connectionId,
            body,
            apiGateway: new ApiGatewayManagementApi({
                endpoint: process.env.SOCKET_ENDPOINT
            })
        }
        
        db = await ConnectionHelper(options?.uri ?? process.env.MONGOOSE_URI);

        if(options?.schemas) {
            options.schemas.forEach(schema => {
                db.models[schema[0]] ?? db.model(schema[0], schema[1])
            });
        }

        return handler(event, db, socket);
    }

    return Use(instance)
        .use(Interceptor());
}