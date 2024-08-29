import { STAGE } from './domain/enums/stage_enum'
import { IUserRepository } from './domain/irepositories/user_repository_interface'
import { UserRepositoryCognito } from './infra/repositories/user/user_repository_cognito'
// import { UserRepositoryMock } from './infra/repositories/user_repository_mock'
import { envs } from './helpers/envs/envs'
import { IMailRepository } from './domain/irepositories/mail_repository_interface'
import { MailRepository } from './infra/repositories/mail/mail_repository_nodemailer'

export class Environments {
  stage: STAGE = STAGE.TEST
  s3BucketName: string = ''
  region: string = ''
  userPoolId: string = ''
  clientId: string = ''

  configureLocal() {
    console.log('envs.STAGE - [ENVIRONMENTS - { CONFIGURE LOCAL }] - ', envs.STAGE)
    envs.STAGE = envs.STAGE || 'TEST'
  }

  loadEnvs() {
    if (!envs.STAGE) {
      this.configureLocal()
    }

    this.stage = envs.STAGE as STAGE

    if (this.stage === STAGE.TEST) {
      this.s3BucketName = 'bucket-test'
      this.region = 'sa-east-1'
    } else {
      this.s3BucketName = envs.S3_BUCKET_NAME as string
      this.region = envs.AWS_REGION as string
      this.userPoolId = envs.COGNITO_USER_POOL_ID as string
      this.clientId = envs.COGNITO_CLIENT_ID as string
    }
  }

  static getUserRepo(): IUserRepository {
    console.log('Environments.getEnvs().stage - [ENVIRONMENTS - { GET USER REPO }] - ', Environments.getEnvs().stage)

    if (Environments.getEnvs().stage === STAGE.TEST) {
      throw new Error('Invalid STAGE')
    } else if (Environments.getEnvs().stage === STAGE.DEV || Environments.getEnvs().stage === STAGE.PROD) {
      return new UserRepositoryCognito(Environments.getEnvs().userPoolId, Environments.getEnvs().clientId)
    } else {
      throw new Error('Invalid STAGE')
    }
  }
  
  static getMailRepo(): IMailRepository {
    console.log('Environments.getEnvs().stage - [ENVIRONMENTS - { GET USER REPO }] - ', Environments.getEnvs().stage)

    if (Environments.getEnvs().stage === STAGE.TEST) {
      throw new Error('Invalid STAGE')
    } else if (Environments.getEnvs().stage === STAGE.DEV || Environments.getEnvs().stage === STAGE.PROD) {
      return new MailRepository()
    } else {
      throw new Error('Invalid STAGE')
    }
  }


  static getEnvs() {
    const envs = new Environments()
    envs.loadEnvs()

    console.log('envs - [ENVIRONMENTS - { GET ENVS }] - ', envs)
    return envs
  }
}