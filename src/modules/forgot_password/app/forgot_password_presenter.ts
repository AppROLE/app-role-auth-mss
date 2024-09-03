import { Environments } from 'src/shared/environments'
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests'
import { ForgotPasswordController } from './forgot_password_controller'
import { ForgotPasswordUseCase } from './forgot_password_usecase'

const repo = Environments.getAuthRepo()
const mailRepo = Environments.getMailRepo()
const usecase = new ForgotPasswordUseCase(repo, mailRepo)
const controller = new ForgotPasswordController(usecase)

export async function forgotPasswordPresenter(event: Record<string, any>) {
  const httpRequest = new LambdaHttpRequest(event)
  const response = await controller.handle(httpRequest)
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers,
  )

  return httpResponse.toJSON()
}

export async function lambda_handler(event: any, context: any) {
  const response = await forgotPasswordPresenter(event)
  return response
}