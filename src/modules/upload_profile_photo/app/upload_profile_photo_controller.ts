import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { UploadProfilePhotoUseCase } from "./upload_profile_photo_usecase";
import { UploadProfilePhotoViewmodel } from "./upload_profile_photo_viewmodel";
import { BadRequest, InternalServerError, NotFound, OK } from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { MissingParameters } from "src/shared/helpers/errors/controller_errors";

export class UploadProfilePhotoController {
  constructor(private readonly usecase: UploadProfilePhotoUseCase) {}

  async handle(request: IRequest, formData: any) {
    try {  
      console.log('FORM DATA', formData)
      console.log('FORM DATA files filename', formData.files.filename)
      const email = formData.fields.email
      const username = formData.fields.username
      const typePhoto = formData.fields.typePhoto

      if (!email) {
        throw new MissingParameters("email")
      }
      if (!username) {
        throw new MissingParameters("username")
      }
      if (!typePhoto) {
        throw new MissingParameters("typePhoto")
      }


      console.log('EMAIL', email)
      console.log('USERNAME', username)
  
      const imagesData = formData.files.map((file: any) => {
        return file.data
      }) as Buffer[]
  
      const fieldNames = formData.files.map((file: any) => {
        return file.fieldname
      }) as string[]

      const mimetypes = formData.files.map((file: any) => {
        return file.mimeType
      }) as string[]
  
  
      console.log('IMAGES DATA', imagesData)
      console.log('FIELD NAMES', fieldNames)
      console.log('MIMETYPES', mimetypes)
  
  
      await this.usecase.execute(email, username, imagesData[0], typePhoto, mimetypes[0])
  
      const viewmodel = new UploadProfilePhotoViewmodel("A foto de perfil foi adicionada com sucesso!")
  
      return new OK(viewmodel.toJSON())

    } catch (error: any) {
      if (error instanceof EntityError) {
        return new BadRequest(error.message)
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message)
      }
      if (error instanceof Error) {
        return new InternalServerError("Internal Server Error, error: " + error.message)
      }
    }

  } 
}