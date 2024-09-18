import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { DeleteAccountUseCase } from "./delete_account_usecase";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import { ForbiddenAction, UserNotRegistered } from "src/shared/helpers/errors/usecase_errors";
import { BadRequest, OK, Unauthorized } from "src/shared/helpers/external_interfaces/http_codes";
import { DeleteAccountViewmodel } from "./delete_account_viewmodel";

export class DeleteAccountController {
  constructor(private readonly usecase: DeleteAccountUseCase) {}

  async handle(requesterUser: Record<string, any>) {
    try {
      const authorizerUser = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData()
      if (!authorizerUser.username) throw new ForbiddenAction("usuário");

      const username = authorizerUser.username
      const email = authorizerUser.email

      await this.usecase.execute(username, email);

      const viewmodel = new DeleteAccountViewmodel("Conta deletada com sucesso!");

      return new OK(viewmodel.toJSON());

    } catch (error: any) {
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }

      if (error instanceof UserNotRegistered) {
        return new BadRequest(error.message);
      }
    }
  }
}