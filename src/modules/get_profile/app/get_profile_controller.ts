import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetProfileUseCase } from "./get_profile_usecase";
import { InternalServerError, OK } from "src/shared/helpers/external_interfaces/http_codes";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import { GetProfileViewmodel } from "./get_profile_viewmodel";

export class GetProfileController {
  constructor(private readonly usecase: GetProfileUseCase) {}

  async handle(request: IRequest) {
    try {
      const requesterUser = request.data.claims as any
      console.log('requesterUser with req.data.claims', requesterUser);

      const { userId, username } = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();

      console.log('username after api gateway dto', username);
      const profile = await this.usecase.execute(username);

      const viewmodel = new GetProfileViewmodel(
        profile.userId,
        profile.name,
        profile.username,
        profile.following,
        profile.followers,
      )

      return new OK(viewmodel.toJSON())

    } catch (error: any) {
      if (error instanceof Error) {
        return new InternalServerError(`GetProfileController, Error on handle: ${error.message}`);
      }
    }
  }
}