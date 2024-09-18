import { Environments } from "src/shared/environments";
import {
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { DeleteAccountUseCase } from "./delete_account_usecase";
import { DeleteAccountController } from "./delete_account_controller";
import { getRequesterUser } from "src/shared/utils/get_requester_user";

const authRepo = Environments.getAuthRepo();
const userRepo = Environments.getUserRepo();
const usecase = new DeleteAccountUseCase(authRepo, userRepo);
const controller = new DeleteAccountController(usecase);

export async function deleteAccountPresenter(
  event: Record<string, any>
) {
  const requesterUser = getRequesterUser(event);
  const response = await controller.handle(requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );
  

  return httpResponse.toJSON();
}

export async function lambda_handler(event: any, context: any) {
  const response = await deleteAccountPresenter(event);
  return response;
}
