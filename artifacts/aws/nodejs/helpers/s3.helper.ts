import { S3 } from "aws-sdk";
import { ClientConfiguration } from "aws-sdk/clients/acm";
import { PutObjectRequest } from "aws-sdk/clients/s3";

export class S3Helper {

    private s3Client: S3;

    constructor(
        private config: ClientConfiguration
    ) {
        this.s3Client = new S3(this.config);
    }

    async uploadFile(params: PutObjectRequest) {
        await this.s3Client.upload(params, (err: Error) => {
            if(err) {
                throw err;
            }

        }).promise();

        return this.getS3Url(this.s3Client.config.region!, params.Bucket, params.Key);
    }

    getS3Url(region: string, bucket: string, file: string): string {
        return `https://${bucket}.s3.amazonaws.com/${file}`
    }
}