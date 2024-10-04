import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import { CreateReviewUseCase } from './create_review_usecase';
import { UserAPIGatewayDTO } from 'src/shared/infra/dto/user_api_gateway_dto';
import { ForbiddenAction, NoItemsFound } from 'src/shared/helpers/errors/usecase_errors';
import { MissingParameters, WrongTypeParameters } from 'src/shared/helpers/errors/controller_errors';
import { CreateReviewViewmodel } from './create_review_viewmodel';
import { BadRequest, Created, InternalServerError, NotFound, OK, Unauthorized } from 'src/shared/helpers/external_interfaces/http_codes';
import { EntityError } from 'src/shared/helpers/errors/domain_errors';

export class CreateReviewController {
  constructor(private readonly usecase: CreateReviewUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const parsedUserApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser).getParsedData();

      if (!parsedUserApiGateway) throw new ForbiddenAction('usuário')

      const { star, review, reviewedAt, instituteId, eventId } = request.data

      if (!star) throw new MissingParameters('star')
      if (!review) throw new MissingParameters('review')
      if (!reviewedAt) throw new MissingParameters('reviewedAt')
      if (!instituteId) throw new MissingParameters('instituteId')
      if (!eventId) throw new MissingParameters('eventId')

      if (typeof star !== 'number') throw new WrongTypeParameters('star', 'number', typeof star)
      if (typeof review !== 'string') throw new WrongTypeParameters('review', 'string', typeof review)
      if (typeof reviewedAt !== 'number') throw new WrongTypeParameters('reviewedAt', 'string', typeof reviewedAt)
      if (typeof instituteId !== 'string') throw new WrongTypeParameters('instituteId', 'string', typeof instituteId)
      if (typeof eventId !== 'string') throw new WrongTypeParameters('eventId', 'string', typeof eventId)

      await this.usecase.execute(
        star,
        review,
        reviewedAt,
        instituteId,
        eventId,
        parsedUserApiGateway.username,
      )
        
      const viewmodel = new CreateReviewViewmodel('Avaliação criada com sucesso!')

      return new Created(viewmodel.toJSON())
      
    } catch (error) {
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