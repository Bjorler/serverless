import { MongooseResolver, ApiEvent, MongooseDb, BaseModel } from "@resolvers/mongoose.resolver";
import { MySQLDB, MySQLResolver } from "@resolvers/mysql.resolver";
import { usersSchema, IUsers } from "@schemas/users.schema";

import { User } from "../../entities/user.entity";

const deleteUsers = async(event: ApiEvent, db: MySQLDB) => {
    const userId = event.pathParameters?.id;

    const user = await db.getRepository(User).findOne({
        where: {
            id: userId,
        }
    });

    if(user){
        await db.getRepository(User).delete(user);
    }else{
        throw new Error(`No existe el usuario`);
    }

}

export const handler = MySQLResolver(deleteUsers, {
    // schemas: [usersSchema],
});