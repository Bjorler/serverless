import { MongooseResolver, ApiEvent, MongooseDb, BaseModel } from "@resolvers/mongoose.resolver";
import { MySQLDB, MySQLResolver } from "@resolvers/mysql.resolver";
import { usersSchema, IUsers } from "@schemas/users.schema";
import { CreateUsersValidator, ICreateUsersValidator } from "@validators/users/create.validator";

import { User } from '../../entities/user.entity';


const createUsers = async(event: ApiEvent<ICreateUsersValidator>, db: MySQLDB) => {

    const user = await db.getRepository('User').findOne({
        where: {
            email: event.body.email,
        }
    })

    if(user){
        throw new Error(`El email ya esta registrado`);
    }else{
        const user = db.getRepository(User).create(event.body);
        return await db.getRepository(User).save(user);
    }

}

export const handler = MySQLResolver(createUsers, {
    
    // schemas: [usersSchema],
    validate: CreateUsersValidator,
});