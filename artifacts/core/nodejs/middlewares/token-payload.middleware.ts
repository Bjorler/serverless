export const TokenPayload = () => {

    const before = async(request: any) => {
        const payload = request.event.requestContext.authorizer?.claims
            ?? request.event.requestContext.authorizer; 
        const token = request.event.headers?.Authorization;

        if(payload && token) {
            request.event.payload = { 
                ...payload, 
                ...{ token: token.replace('Bearer ', '') } 
            }
        }
    }

    return {
        before,
    }
}