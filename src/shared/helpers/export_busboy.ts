import Busboy from 'busboy'

export async function parseMultipartFormData(request: Record<string, any>): Promise<Record<string, any>>{
  const contentType = request.headers['content-type'] || request.headers['Content-Type'] as any
  if (!contentType || !contentType.includes('multipart/form-data')) {
    throw new Error('Content-Type da requisição não é multipart/form-data')
  }

  const contentLength = request.headers['content-length'] || request.headers['Content-Length']

  console.log('contentLength', contentLength)


  const busboy = Busboy({ headers: { 
    'content-type': contentType, 
    "content-length": contentLength,
  }})
  const result: Record<string, any> = {
    files: [],
    fields: {},
  }

  return new Promise((resolve, reject) => {
    busboy.on('file', (fieldname: any, file: any, infos: any) => {
      console.log('form-data infos: ', infos)
      const { filename, encoding, mimeType } = infos
      console.log(`Recebendo arquivo: ${fieldname}`)
      
      const chunks: Buffer[] = []

      file.on('data', (chunk: Buffer) => {
        console.log(`Recebendo dados do arquivo: ${fieldname}`)
        chunks.push(chunk)
      })
      
      
      .on('end', () => {
        const completeFile = Buffer.concat(chunks)
        // Garante que o arquivo foi completamente recebido
        console.log(`Arquivo recebido: ${filename}`)
        result.files.push({
          fieldname,
          filename,
          encoding,
          mimeType,
          data: completeFile,
        });
      });
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

    console.log('IS BASE 64 ENCODED', request.isBase64Encoded)

    const body = request.isBase64Encoded 
      ? Buffer.from(request.body, 'base64') 
      : request.body;
    busboy.write(body);
    busboy.end()
  })
}