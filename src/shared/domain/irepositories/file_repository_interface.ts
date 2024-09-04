export interface IFileRepository {
  uploadProfilePhoto(
    imageNameKey: string,
    profilePhoto: Buffer,
  ): Promise<string>;
}