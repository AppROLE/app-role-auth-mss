import Busboy from 'busboy'

export async function parseMultipartFormData(request: Record<string, any>): Promise<Record<string, any>>{
  const contentType = request.headers['content-type'] || request.headers['Content-Type'] as any
  if (!contentType || !contentType.includes('multipart/form-data')) {
    throw new Error('Content-Type da requisição não é multipart/form-data')
  }

  const busboy = Busboy({ headers: { 'content-type': contentType } })
  const result: Record<string, any> = {
    files: [],
    fields: {},
  }

  return new Promise((resolve, reject) => {
    busboy.on('file', (fieldname: any, file: any, infos: any) => {
      console.log('form-data infos: ', infos)
      const { filename, encoding, mimeType } = infos
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
          mimeType,
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

    const body = request.isBase64Encoded 
      ? Buffer.from(request.body, 'base64') 
      : request.body;
    busboy.write(body, 'binary');
    busboy.end()
  })
}