import type { APIGatewayProxyEvent } from "aws-lambda";

export type ApiEvent<T = any> = Omit<APIGatewayProxyEvent, 'body'> & { body: T, payload: any }