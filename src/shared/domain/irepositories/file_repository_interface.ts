export interface IFileRepository {
  uploadProfilePhoto(
    imageNameKey: string,
    profilePhoto: Buffer,
    mimetype: string
  ): Promise<string>;
}