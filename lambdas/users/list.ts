import { MongooseResolver, ApiEvent, MongooseDb, BaseModel } from "@resolvers/mongoose.resolver";
import { MySQLDB, MySQLResolver } from "@resolvers/mysql.resolver";
import { usersSchema, IUsers } from "@schemas/users.schema";

import { User } from "../../entities/user.entity";


const listUsers = async(event: ApiEvent, db: MySQLDB) => {

    const users = await db.getRepository(User).find();

    return users;
}

export const handler = MySQLResolver(listUsers, {
    // schemas: [usersSchema],
});