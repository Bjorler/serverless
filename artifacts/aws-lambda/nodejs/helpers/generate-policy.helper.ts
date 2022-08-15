import { PolicyDocument, AuthResponse } from "aws-lambda";

export const generatePolicy = (effect: string, resource: string, payload?: any): AuthResponse  => {
    const statementOne: any = {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
    };
    
    const policyDocument: PolicyDocument = {
        Version: '2012-10-17',
        Statement: [],
    }

    policyDocument.Statement[0] = statementOne;

    return {
        principalId: 'user',
        policyDocument: policyDocument,
        context: payload ?? null
    }
}