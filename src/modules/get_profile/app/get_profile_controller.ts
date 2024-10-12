import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetProfileUseCase } from "./get_profile_usecase";
import { InternalServerError, OK } from "src/shared/helpers/external_interfaces/http_codes";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import { GetProfileViewmodel } from "./get_profile_viewmodel";
import { ForbiddenAction } from "src/shared/helpers/errors/usecase_errors";

export class GetProfileController {
  constructor(private readonly usecase: GetProfileUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {

      if (!requesterUser) throw new ForbiddenAction('usuário')

      const personUsername = request.data.personUsername
      
      const { userId, username } = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();

      let profile;

      if (personUsername && personUsername !== username && typeof personUsername === 'string') {
        profile = await this.usecase.execute(personUsername);
      } else {
        profile = await this.usecase.execute(username);
      }

      console.log('username after api gateway dto', username);
      

      const viewmodel = new GetProfileViewmodel(
        profile.userId,
        profile.name,
        profile.username,
        profile.following,
        profile.followers,
        profile.privacy,
        profile.biography,
        profile.profilePhoto,
        profile.backgroundPhoto,
        profile.linkTiktok,
        profile.linkInstagram,
      )

      return new OK(viewmodel.toJSON())

    } catch (error: any) {
      if (error instanceof Error) {
        return new InternalServerError(`GetProfileController, Error on handle: ${error.message}`);
      }
    }
  }
}