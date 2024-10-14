import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { FollowUserUseCase } from "./follow_user_usecase";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { ForbiddenAction, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { MissingParameters, WrongTypeParameters } from "src/shared/helpers/errors/controller_errors";
import { BadRequest, InternalServerError, NotFound, OK, Unauthorized } from "src/shared/helpers/external_interfaces/http_codes";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import { FollowUserViewModel } from "./follow_user_viewmodel";

export class FollowUserController {
    constructor(private readonly useCase: FollowUserUseCase) {}

    async handle(req: IRequest, requesterUser: Record<string, any>) {
        try {
            const parsedUserApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
            if (!parsedUserApiGateway) throw new ForbiddenAction('usuário')

            const { followedUsername } = req.data

            if (!followedUsername) throw new MissingParameters('followedUsername')
            if (typeof followedUsername !== 'string') throw new WrongTypeParameters('followedUsername', 'string', typeof followedUsername)
            
            await this.useCase.execute(parsedUserApiGateway.username, followedUsername)
            const viewmodel = new FollowUserViewModel('Seguidor atualizado com sucesso!')

            return new OK(viewmodel)
        } catch (error: any) {
            if (error instanceof EntityError) {
                return new BadRequest(error.message)
            }
            if (error instanceof ForbiddenAction) {
                return new Unauthorized(error.message)
            }
            if (error instanceof MissingParameters) {
                return new BadRequest(error.message)
            }
            if (error instanceof WrongTypeParameters) {
                return new BadRequest(error.message)
            }
            if (error instanceof NoItemsFound) {
                return new NotFound(error.message)
            }
            if (error instanceof Error) {
                return new InternalServerError(error.message)
            }
        }
    }
}