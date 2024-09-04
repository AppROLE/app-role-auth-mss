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
        ACL: 'public-read',
        ContentType: 'image/jpeg',
      };

      const result = await s3.upload(params).promise();



      return result.Location;
    } catch (error: any) {
      throw new Error(`FileRepositoryS3, Error on uploadProfilePhoto: ${error.message}`);
    }
  }
}