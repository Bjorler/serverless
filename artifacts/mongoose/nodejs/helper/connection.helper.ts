import { createConnection, Mongoose } from "mongoose";

let con: any = null;

export const ConnectionHelper = async(uri: string = 'mongodb://localhost:27017') => {
    if(con == null) {
        
        con = createConnection(uri, {
            serverSelectionTimeoutMS: 5000
        })
    
        await con.asPromise();
    }

    return con;
}