import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { FindPersonUseCase } from "./find_person_usecase";
import { MissingParameters, WrongTypeParameters } from "src/shared/helpers/errors/controller_errors";
import { FindPersonViewmodel, PersonViewmodel } from "./find_person_viewmodel";
import { BadRequest, InternalServerError, NotFound, OK, Unauthorized } from "src/shared/helpers/external_interfaces/http_codes";
import { ForbiddenAction, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class FindPersonController {
  constructor(private readonly usecase: FindPersonUseCase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      if (!requesterUser) new ForbiddenAction('usuário');

      const searchTerm = request.data.searchTerm;

      if (!searchTerm) throw new MissingParameters('termoDeBusca');

      if (typeof searchTerm !== 'string') throw new WrongTypeParameters('termoDeBusca', 'string', typeof searchTerm);

      const persons = await this.usecase.execute(searchTerm);

      const viewmodel = new FindPersonViewmodel(persons.map((person) => {
        return new PersonViewmodel(person.username, person.nickname, person.profilePhoto);
      }));
      
      return new OK(viewmodel.toJSON());
      
    } catch (error: any) {
      if (error instanceof WrongTypeParameters || error instanceof MissingParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message);
      }
    }
  }
}