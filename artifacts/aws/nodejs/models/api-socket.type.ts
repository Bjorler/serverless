import { ApiGatewayManagementApi } from "aws-sdk";

export interface ApiSocket<T> {
    connectionId: string
    body: bodyOrNull<T>,
    apiGateway: ApiGatewayManagementApi
}

type bodyOrNull<T> = T | null; 

