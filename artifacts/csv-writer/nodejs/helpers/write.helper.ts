import { createObjectCsvWriter } from "csv-writer";
import { ObjectStringifierHeader } from "csv-writer/src/lib/record";
import { readFileSync } from "fs";
import { pathExistsSync, mkdir } from "fs-extra";

export interface CsvOptions {
    name?: string,
    fieldDelimiter?: string
    encoding?: string
}

export const WriteHelper = async(data: Array<Object>, headers: ObjectStringifierHeader, options?: CsvOptions) => {
    let fileName = options?.name;

    if(!options?.name) {
        const dt = new Date();
        fileName = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDay()}.csv`;
    }

    const outputPath = '/tmp/'+fileName!;

    if(!pathExistsSync(outputPath)) {
        mkdir('/tmp/');
    }

    const csvFile = createObjectCsvWriter({
        path: outputPath,
        header: headers,
        fieldDelimiter: options?.fieldDelimiter ?? ',',
        encoding: options?.encoding ?? 'utf-8'
    });

    await csvFile.writeRecords(data);

    return readFileSync(outputPath, { encoding: "utf-8" })
}