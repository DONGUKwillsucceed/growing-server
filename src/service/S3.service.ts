import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { createReadStream } from 'fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NoEnvVarError } from 'src/common/error';

@Injectable()
export class S3Service {
  private s3: S3;
  private s3Client: S3Client;

  constructor() {
    const { SIGNATUREVERSION, REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY } =
      process.env;
    if (!SIGNATUREVERSION || !REGION || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
      console.log('envError');
      // throw new NoEnvVarError(
      //   JSON.stringify({
      //     SIGNATUREVERSION,
      //     REGION,
      //     ACCESS_KEY_ID,
      //     SECRET_ACCESS_KEY,
      //   }),
      // );
    }

    this.s3 = new S3({
      signatureVersion: SIGNATUREVERSION,
      region: REGION,
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    });

    this.s3Client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });
  }

  bucket(s3Url: URL) {
    return s3Url.hostname;
  }

  name(s3Url: URL) {
    return decodeURI(s3Url.pathname).slice(1);
  }

  params(s3Url: URL) {
    const bucket = this.bucket(s3Url);
    const key = this.name(s3Url);
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: 30000,
    };
    return params;
  }

  async isExist(s3Url: URL) {
    const bucketParams = this.params(s3Url);
    try {
      await this.s3.headObject(bucketParams).promise();
      return true;
    } catch (err) {
      return false;
    }
  }

  async getObjectUrl(s3Url: URL) {
    const bucketParams = this.params(s3Url);
    const response = this.s3.getSignedUrl('getObject', bucketParams);
    return response;
  }

  async getUploadUrl(s3Url: URL) {
    const bucketParams = this.params(s3Url);
    console.log(bucketParams);
    const response = this.s3.getSignedUrl('putObject', bucketParams);
    return response;
  }

  async getObjectSize(s3Url: URL) {
    const bucket = this.bucket(s3Url);
    const key = this.name(s3Url);
    return this.s3
      .headObject({
        Bucket: bucket,
        Key: key,
      })
      .promise()
      .then((res) => res.ContentLength);
  }

  async getObjectList(s3Url: URL) {
    const bucket = this.bucket(s3Url);
    const prefix = this.name(s3Url);
    const objects = await this.s3
      .listObjects({
        Bucket: bucket,
        Prefix: prefix,
      })
      .promise()
      .then((data) => data.Contents);
    if (!objects) {
      throw new Error('Not Found Error');
    }
    const files: string[] = objects.map((file) => {
      if (!file.Key) {
        throw new Error('Not Found Error');
      }
      return file.Key;
    });
    return files
      .map((file) => {
        const s3Path = `s3://${bucket}/${file}`;
        return new URL(s3Path);
      })
      .splice(-1, 1); // file이 위치한 폴더의 값이 마지막 인덱스로 출력됨.
  }

  async getObjectUrls(s3Url: URL) {
    const objectList = await this.getObjectList(s3Url);
    return Promise.all(objectList.map((s3Url) => this.getObjectUrl(s3Url)));
  }

  async uploadFile(s3Url: URL, filePath: string) {
    const readStream = createReadStream(filePath);
    const uploadParam = {
      Bucket: s3Url.hostname,
      // Add the required 'Key' parameter using the 'path' module.
      Key: decodeURI(s3Url.pathname).slice(1),
      // Add the required 'Body' parameter
      Body: readStream,
    };
    try {
      const data = await this.s3Client.send(new PutObjectCommand(uploadParam));
      console.log('[S3Service]uploadFile finish', data);
      return data; // For unit tests.
    } catch (err) {
      console.log('[S3Service]uploadFile fail', err);
      throw err;
    }
  }
}
