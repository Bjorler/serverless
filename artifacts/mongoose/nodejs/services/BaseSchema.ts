import { 
    SchemaDefinition, 
    SchemaDefinitionType, 
    Schema,
    SchemaOptions,
    Model,
    Query,
    Document,
    MongooseError,
} from "mongoose";

export interface BaseSchemaModel extends Model<any> {
    onNull(scode: string): this;
    onError(scode: string): this;
}

export class BaseSchema<DocType = any, M = Model<DocType, any, any, any>, TInstanceMethods = {}, TQueryHelpers = {}> extends Schema {

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
        
        let errorOnNull: string;
        this.static('onNull', function onNull(scode: string) {
            errorOnNull = scode;
            return this;
        });
        
        let errorOnError: string;
        this.static('onError', function onNull(scode: string) {
            errorOnError = scode;
            return this;
        });

        this.post('save', function(err: any, doc: any, next: any) {
            if(err && err.code === 11000) {
                throw {
                    scode: 'duplicate',
                    sdebug: err.message ?? ''
                }
            }
            if(err && errorOnError) {
                throw {
                    scode: errorOnError,
                    sdebug: err.message ?? ''
                }
            }
            next();
        });

        this.post('findOne', function(doc) {
            if(!doc && errorOnNull) {
                throw { scode: errorOnNull }
            }
        });

        this.post('findOneAndDelete', function(doc) {
            if(!doc && errorOnNull) {
                throw { scode: errorOnNull }
            }
        });

        this.post('findOneAndRemove', function(doc) {
            if(!doc && errorOnNull) {
                throw { scode: errorOnNull }
            }
        });

        this.post('findOneAndUpdate', function(doc) {
            if(!doc && errorOnNull) {
                throw { scode: errorOnNull }
            }
        });

        this.post('findOneAndReplace', function(doc) {
            if(!doc && errorOnNull) {
                throw { scode: errorOnNull }
            }
        });

        this.post('findById', function(doc) {
            if(!doc && errorOnNull) {
                throw { scode: errorOnNull }
            }
        });

        this.post('findByIdAndDelete', function(doc) {
            if(!doc && errorOnNull) {
                throw { scode: errorOnNull }
            }
        });

        this.post('findByIdAndRemove', function(doc) {
            if(!doc && errorOnNull) {
                throw { scode: errorOnNull }
            }
        });

        this.post('findByIdAndUpdate', function(doc) {
            if(!doc && errorOnNull) {
                throw { scode: errorOnNull }
            }
        });


    }

    
}