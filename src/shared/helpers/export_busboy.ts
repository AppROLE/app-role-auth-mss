import Busboy from 'busboy'
import { IRequest } from './external_interfaces/external_interface'

export async function parseMultipartFormData(request: IRequest): Promise<Record<string, any>>{
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
    console.log('request.data.body', request.data.body)
    const isBase64Encoded = request.data.isBase64Encoded as BufferEncoding
    console.log('request.data.isBase64Encoded', request.data.isBase64Encoded)
    busboy.write(request.data.body, 'binary')
    busboy.end()
  })
}