import { Schema } from "mongoose";

export const SchemaHelper = (schema: any) => {
    return new Schema(schema, {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
        versionKey: false,
        id: false,
        timestamps: true
    });
}

export class MySchema<DocType = any> {
    constructor(private schema: any) {}

    Schema() {
        return new Schema<DocType>(this.schema, {
            toObject: { virtuals: true },
            toJSON: { virtuals: true },
            versionKey: false,
            id: false,
            timestamps: true
        })
    }
}