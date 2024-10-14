import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { GetAllFollowersUseCase } from "./get_all_followers_usecase";
import { ForbiddenAction, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { MissingParameters, WrongTypeParameters } from "src/shared/helpers/errors/controller_errors";
import { BadRequest, InternalServerError, NotFound, OK, Unauthorized } from "src/shared/helpers/external_interfaces/http_codes";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import { GetAllFollowersViewModel } from "./get_all_followers_viewmodel";
import { User } from "src/shared/domain/entities/user";

export class GetAllFollowersController {
    constructor (private usecase: GetAllFollowersUseCase) {}

    async handle(req: IRequest, requesterUser: Record<string, any>) {
        try {
            const parsedUserApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
            if (!parsedUserApiGateway) throw new ForbiddenAction('usuário')

            const users = await this.usecase.execute(parsedUserApiGateway.username)

            return new OK(
                users.map((user: User) => new GetAllFollowersViewModel(user.userName, user.userId, user.userProfilePhoto)).map(user => user.toJSON())
            ) 
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