import { MongooseAuthResolver, ApiAuthEvent, GeneratePolicy, Tokenizer, MongooseDb, BaseModel } from "@resolvers/mongoose-auth.resolver";
import { ISession, sessionSchema } from "@schemas/session.schema";

const tokenAuthorizer = async(event: ApiAuthEvent, db: MongooseDb) => {
    const tokenPayload = Tokenizer(
        event.authorizationToken, process.env.TOKEN_KEY!); 
        
    const token = event.authorizationToken.replace('Bearer ', '');

    const session = await db.model<ISession, BaseModel>('session')
        .findOne({ token });
    
    if(tokenPayload && session) {
        return GeneratePolicy('Allow', "*", tokenPayload);
    } else {
        return GeneratePolicy('Deny', event.methodArn);
    }
}

export const handler = MongooseAuthResolver(tokenAuthorizer, {
    schemas: [sessionSchema]
});