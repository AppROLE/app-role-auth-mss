import { IFileRepository } from "src/shared/domain/irepositories/file_repository_interface";
import { S3 } from 'aws-sdk';


export class FileRepositoryS3 implements IFileRepository {
  s3BucketName: string;

  constructor(s3BucketName: string) {
    this.s3BucketName = s3BucketName;
  }

  async uploadProfilePhoto(imageNameKey: string, profilePhoto: Buffer): Promise<string> {
    try {
      const s3 = new S3();
      const params = {
        Bucket: this.s3BucketName,
        Key: imageNameKey,
        Body: profilePhoto,
        ContentType: 'image/jpeg',
      };

      await s3.putObject(params).promise();

      return `https://${this.s3BucketName}.s3.amazonaws.com/${imageNameKey}`;
    } catch (error: any) {
      throw new Error(`FileRepositoryS3, Error on uploadProfilePhoto: ${error.message}`);
    }
  }
}