import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { UpdateProfileUseCase } from "./update_profile_usecase";
import { MissingParameters, WrongTypeParameters } from "src/shared/helpers/errors/controller_errors";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import { DuplicatedItem, ForbiddenAction, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { BadRequest, InternalServerError, NotFound, OK, Unauthorized } from "src/shared/helpers/external_interfaces/http_codes";
import { UpdateProfileViewmodel } from "./update_profile_viewmodel";

export class UpdateProfileController {
  constructor(
    private readonly usecase: UpdateProfileUseCase
  ) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const parsedUserApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();

      const newUsername = request.data.username;
      const password = request.data.password;
      const nickname = request.data.nickname;
      const biography = request.data.biography;
      const instagramLink = request.data.instagramLink;
      const tiktokLink = request.data.tiktokLink;

      if (newUsername && typeof newUsername !== 'string') throw new WrongTypeParameters('newUsername', 'string', typeof newUsername);
      if (password && typeof password !== 'string') throw new WrongTypeParameters('password', 'string', typeof password);
      if (nickname && typeof nickname !== 'string') throw new WrongTypeParameters('nickname', 'string', typeof nickname);
      if (biography && typeof biography !== 'string') throw new WrongTypeParameters('biography', 'string', typeof biography);
      if (instagramLink && typeof instagramLink !== 'string') throw new WrongTypeParameters('instagramLink', 'string', typeof instagramLink);
      if (tiktokLink && typeof tiktokLink !== 'string') throw new WrongTypeParameters('tiktokLink', 'string', typeof tiktokLink);
      
      if (newUsername && parsedUserApiGateway.username !== newUsername) throw new ForbiddenAction('usuário');

      if (newUsername && !password) throw new MissingParameters('senha');

      if (newUsername || nickname || biography || instagramLink || tiktokLink || password) {
        await this.usecase.execute(
          parsedUserApiGateway.email,
          parsedUserApiGateway.username,
          newUsername as string | undefined,
          password as string | undefined,
          nickname as string | undefined,
          biography as string | undefined,
          instagramLink as string | undefined,
          tiktokLink as string | undefined
        );
      }

      const viewmodel = new UpdateProfileViewmodel('Perfil atualizado com sucesso');

      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (error instanceof MissingParameters || error instanceof WrongTypeParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message);
      }
      if (error instanceof DuplicatedItem) {
        return new BadRequest(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }
      if (error instanceof WrongTypeParameters) {
        return new BadRequest(error.message);
      }
    }
  }
}