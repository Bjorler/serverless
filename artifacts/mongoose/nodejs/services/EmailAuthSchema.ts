import { 
    SchemaDefinition, 
    SchemaDefinitionType, 
    Schema,
    SchemaOptions
} from "mongoose";
import bcryptjs from 'bcryptjs';

export interface IEmailAuthMethods {
    authenticate(email: string, password: string): any
}

export class EmailAuthSchema<DocType = any> extends Schema {
    constructor(
        definition?: SchemaDefinition<SchemaDefinitionType<DocType>>, 
        options?: SchemaOptions
    ) {
        const baseOptions: SchemaOptions = options ?? {
            toObject: { virtuals: true },
            toJSON: { virtuals: true },
            versionKey: false,
            id: false,
            timestamps: true
        }
        super(definition, baseOptions);

        this.static('authenticate', async function signin(email: string, password:string) {
            const user = await this.findOne({email}, '+password');
            
            if(user && bcryptjs.compareSync(password, user.password)) {
                const newUser = user.toObject();
                delete newUser.password;
                return newUser;
            }
        
            return null;
        })

        this.post('save', function(err: any, doc: any, next: any) {
            if(err && err.code === 11000) {
                throw {
                    scode: 'duplicate',
                    sdebug: err.message ?? ''
                }
            }
            next();
        });

        this.pre('save', function(next) {
            this.password = bcryptjs.hashSync(this.password, 10);
            next();
        });
        
        this.post('save', function() {
            this.password = '';
        });
    }
}