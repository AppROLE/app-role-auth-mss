import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetProfileUseCase } from "./get_profile_usecase";
import { InternalServerError } from "src/shared/helpers/external_interfaces/http_codes";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";

export class GetProfileController {
  constructor(private readonly usecase: GetProfileUseCase) {}

  async handle(request: IRequest) {
    try {
      const requesterUser = request.data.requesterUser as any

      const { userId, username } = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();


      const profile = await this.usecase.execute(username);

      

    } catch (error: any) {
      if (error instanceof Error) {
        return new InternalServerError(`GetProfileController, Error on handle: ${error.message}`);
      }
    }
  }
}