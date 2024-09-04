import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { UploadProfilePhotoUseCase } from "./upload_profile_photo_usecase";
import Busboy from 'busboy'
import { UploadProfilePhotoViewmodel } from "./upload_profile_photo_viewmodel";
import { BadRequest, InternalServerError, NotFound, OK } from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { MissingParameters } from "src/shared/helpers/errors/controller_errors";

export class UploadProfilePhotoController {
  constructor(private readonly usecase: UploadProfilePhotoUseCase) {}

  async parseMultipartFormData(request: IRequest): Promise<Record<string, any>>{
    const contentType = request.data['content-type'] || request.data['Content-Type'] as any
    if (!contentType || !contentType.includes('multipart/form-data')) {
      throw new Error('Content-Type da requisição não é multipart/form-data')
    }
    const busboy = Busboy({ headers: { 'content-type': contentType } })
    const result: Record<string, any> = {
      files: [],
      fields: {},
    }
  
    return new Promise((resolve, reject) => {
      busboy.on('file', (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
        console.log(`Recebendo arquivo: ${fieldname}`)
        const fileChunks: Buffer[] = []
        file.on('data', (data: Buffer) => {
          fileChunks.push(data)
        }).on('end', () => {
          console.log(`Arquivo recebido: ${fieldname}`)
          result.files.push({
            fieldname,
            filename,
            encoding,
            mimetype,
            data: Buffer.concat(fileChunks),
          })
        })
      })
  
      busboy.on('field', (fieldname: any, val: any) => {
        console.log(`Recebendo campo: ${fieldname}`)
        result.fields[fieldname] = val
      })
  
      busboy.on('finish', () => {
        console.log('Parse do form-data finalizado')
        resolve(result)
      })
  
      busboy.on('error', (error: any) => {
        console.log('Erro no parse do form-data:', error)
        reject(error)
      })
  
      // Inicia o parsing passando o corpo da requisição
      busboy.write(request.data.body, request.data.isBase64Encoded ? 'base64' : 'binary')
      busboy.end()
    })
  }

  async handle(request: IRequest) {
    try {
      const formData = await this.parseMultipartFormData(request)
  
      const email = formData.fields.email
      const username = formData.fields.username

      if (!email) {
        throw new MissingParameters("email")
      }
      if (!username) {
        throw new MissingParameters("username")
      }

      console.log('EMAIL', email)
      console.log('USERNAME', username)
  
      const imagesData = formData.files.map((file: any) => {
        return file.data
      }) as Buffer[]
  
      const fieldNames = formData.files.map((file: any) => {
        return file.fieldname
      }) as string[]
  
      const extensionNames = fieldNames.map((fieldName: string) => {
        return fieldName.split('.').pop()
      }) as string[]
  
      console.log('IMAGES DATA', imagesData)
      console.log('FIELD NAMES', fieldNames)
      console.log('EXTENSION NAMES', extensionNames)
  
  
      await this.usecase.execute(email, username, imagesData[0], extensionNames[0])
  
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