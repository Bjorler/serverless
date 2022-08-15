export const Permissions = (
    roles?: string[], 
    unauthorized_message?: string,
    forbbiden_message?: string
) => {    
    const before = async(request: any) => {
        
        if(!roles || !Array.isArray(roles) || (Array.isArray(roles) && roles.length == 0)) {
            return;
        }
                
        const payload = request.event.requestContext.authorizer?.claims
        ?? request.event.requestContext.authorizer;   
        
        if(!payload) throw { 
            scode: unauthorized_message ?? 'unauthorized' 
        }
        
        if(!roles.includes(payload.user_role)) throw {
            scode: forbbiden_message ?? 'forbbiden'
        }
    }

    return {
        before,
    }
}