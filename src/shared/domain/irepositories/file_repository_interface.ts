export interface IFileRepository {
  uploadProfilePhoto(
    imageNameKey: string,
    profilePhotoPath: string,
    mimetype: string
  ): Promise<string>;
}