import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetFriendsUseCase } from "./get_friends_usecase";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import { ForbiddenAction } from "src/shared/helpers/errors/usecase_errors";
import { FriendViewmodel, GetFriendsViewmodel } from "./get_friends_viewmodel";
import { OK, Unauthorized } from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";

export class GetFriendsController {
  constructor(private readonly usecase: GetFriendsUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const parsedUserApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
      if (!parsedUserApiGateway) throw new ForbiddenAction('usuário')

      const { username } = parsedUserApiGateway

      const friends = await this.usecase.execute(username)

      if (friends.length === 0) {
        return new OK({ message: 'Nenhum amigo encontrado' })
      }

      const viewmodel = new GetFriendsViewmodel(
        friends.map(friend => new FriendViewmodel(friend.userId || '', friend.userUsername, friend.userNickname || friend.userName,friend.userProfilePhoto))
      )

      return new OK(viewmodel.toJSON())
    } catch(error: any) {
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message)
      }
      if (error instanceof EntityError) {}
    }
  }
}