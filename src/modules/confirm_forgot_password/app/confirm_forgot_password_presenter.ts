import cors from 'cors'
import express from 'express'
import { envs } from '../../../shared/helpers/envs/envs'
import { STAGE } from '../../../shared/domain/enums/stage_enum'
import ServerlessHttp from 'serverless-http'

const app = express()

app.use(express.json())
app.use(cors({
  origin: '*'
}))

app.post('/confirm-forgot-password', (req, res) => {
  return res.json({ message: 'Hello World - Confirm Forgot Password' })
})

if (envs.STAGE === STAGE.DEV 
  || envs.STAGE === STAGE.HOMOLOG 
  || envs.STAGE === STAGE.PROD
) {
  module.exports.lambda_handler = ServerlessHttp(app)
} else {
  app.listen(3000, () => {
    console.log(`Server running on port 3000 in ${STAGE} stage`)
  })
}
