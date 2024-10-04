import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { GetAllReviewsByEventUseCase } from "./get_all_reviews_by_event_usecase";
import { MissingParameters, WrongTypeParameters } from "src/shared/helpers/errors/controller_errors";
import { UserAPIGatewayDTO } from "src/shared/infra/dto/user_api_gateway_dto";
import { GetAllReviewsByEventViewmodel, ReviewViewmodel } from "./get_all_reviews_by_event_viewmodel";
import { ForbiddenAction, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { BadRequest, InternalServerError, NotFound, OK, Unauthorized } from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";

export class GetAllReviewsByEventController {
  constructor(
    private readonly usecase: GetAllReviewsByEventUseCase,
  ) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const parsedUserApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();
      if (!parsedUserApiGateway) throw new ForbiddenAction('usuário')
      const { eventId } = request.data

      if (!eventId) throw new MissingParameters('eventId')
      if (typeof eventId !== 'string') throw new WrongTypeParameters('eventId', 'string', typeof eventId)

      const reviews = await this.usecase.execute(eventId);
      if (reviews.length === 0) throw new NoItemsFound('avaliações')
      return new OK({
        reviews,
        message: 'Avaliações encontradas com sucesso'
      })

    } catch (error: any) {
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message)
      }

      if (error instanceof MissingParameters ||
          error instanceof WrongTypeParameters ||
          error instanceof EntityError
      ) {
        return new BadRequest(error.message)
      }

      if (error instanceof NoItemsFound) return new NotFound({
        message: 'Nenhuma avaliação encontrada'
      })

      if (error instanceof Error) {
        return new InternalServerError(`GetAllReviewsByEventController, Error on handle: ${error.message}`);
      }
    }
  }
}