import { MongooseResolver, ApiEvent, MongooseDb, BaseModel } from "@resolvers/mongoose.resolver";
import { MySQLDB, MySQLResolver } from "@resolvers/mysql.resolver";
import { usersSchema, IUsers } from "@schemas/users.schema";
import { UpdateUsersValidator, IUpdateUsersValidator } from "@validators/users/update.validator";

import { User } from '../../entities/user.entity';

const updateUsers = async(event: ApiEvent<IUpdateUsersValidator>, db: MySQLDB) => {
    const id = event.pathParameters?.id;

    const user = await db.getRepository(User).findOne({
        where: {
            id,
        }
    });

    if(user){
        db.getRepository(User).merge(user, event.body);

        return await db.getRepository(User).save(user);
    }else{
        throw new Error(`No existe el usuario`);
    }
}

export const handler = MySQLResolver(updateUsers, {
    // schemas: [usersSchema],
    validate: UpdateUsersValidator,
});