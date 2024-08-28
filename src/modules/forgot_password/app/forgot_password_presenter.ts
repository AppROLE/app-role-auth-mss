import cors from 'cors'
import express from 'express'
import { ForgotPasswordController } from './forgot_password_controller'
import { ForgotPasswordUseCase } from './forgot_password_usecase'
import { envs } from '../../../envs'
import { STAGE } from '../../../shared/domain/enums/stage_enum'
import { UserRepositoryMongo } from '../../../shared/infra/database/repositories/user_repository_mongo'
import { UserRepositoryCognito } from '../../../shared/infra/repositories/user/user_repository_cognito'
import { MailRepository } from '../../../shared/infra/repositories/mail/mail_repository_nodemailer'
import ServerlessHttp from 'serverless-http'

const app = express()

app.use(express.json())
app.use(cors())


const repo = 
  new UserRepositoryCognito(
    envs.COGNITO_USER_POOL_ID, 
    envs.COGNITO_CLIENT_ID
  )

const mailRepo = new MailRepository()

const usecase = new ForgotPasswordUseCase(repo, mailRepo)

const controller = new ForgotPasswordController(usecase)

app.post('/forgot-password', controller.handle)
app.get('/health', (_, res) => res.status(200).json({ message: 'ok' }))

if (envs.STAGE === STAGE.DEV 
  || envs.STAGE === STAGE.HOMOLOG 
  || envs.STAGE === STAGE.PROD
) {
  module.exports.lambda_handler = ServerlessHttp(app)
}

app.listen(3000, () => {
  console.log(`Server running on port 3000 in ${STAGE} stage`)
})
