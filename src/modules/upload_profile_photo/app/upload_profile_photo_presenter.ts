import { Environments } from "src/shared/environments";
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from "src/shared/helpers/external_interfaces/http_lambda_requests";
import { UploadProfilePhotoUseCase } from "./upload_profile_photo_usecase";
import { UploadProfilePhotoController } from "./upload_profile_photo_controller";

const repo = Environments.getUserRepo()
const fileRepo = Environments.getFileRepo()
const usecase = new UploadProfilePhotoUseCase(repo, fileRepo);
const controller = new UploadProfilePhotoController(usecase);

export async function uploadProfilePhoto(event: Record<string, any>) {
  const httpRequest = new LambdaHttpRequest(event);
  const response = await controller.handle(httpRequest);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}

export async function lambda_handler(event: any, context: any) {
  const response = await uploadProfilePhoto(event);
  return response;
}
