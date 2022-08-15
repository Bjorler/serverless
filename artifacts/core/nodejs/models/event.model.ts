export interface ApiEvent {
    body: string
    httpMethod: string
    path: string
    pathParameters: anyObject
    queryStringParameters: anyObject
    requestContext?: RequestContext
}

interface RequestContext {
    apiId: string
    connectedAt: number
    connectionId: string
    domainName: string
    eventType: string
    extendedRequestId: string
    identity: anyObject
    messageDirection: string
    messageId: string
    requestId: string
    requestTime: string
    requestTimeEpoch: number
    routeKey: string
    stage: string
}

interface anyObject {
    [key: string|number]: string
}