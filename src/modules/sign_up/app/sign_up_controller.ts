import { MissingParameters, WrongTypeParameters } from "src/shared/helpers/errors/controller_errors";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { SignUpUseCase } from "./sign_up_usecase";
import { SignUpViewmodel } from "./sign_up_viewmodel";
import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";
import { BadRequest, Created, InternalServerError } from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { DuplicatedItem } from "src/shared/helpers/errors/usecase_errors";

export class SignUpController {
  constructor(private readonly usecase: SignUpUseCase) {}

  async handle(request: IRequest) {
    try {
      const name = request.data.name;
      const email = request.data.email;
      const password = request.data.password;
      const acceptedTerms = request.data.acceptedTerms;

      if (!name) {
        throw new MissingParameters("name");
      }
      if (!email) {
        throw new MissingParameters("email");
      }
      if (!password) {
        throw new MissingParameters("password");
      }
      if (acceptedTerms !== true) {
        throw new MissingParameters("acceptedTerms");
      }

      if (typeof name !== "string") {
        throw new WrongTypeParameters("name", "string", typeof name);
      }
      if (typeof email !== "string") {
        throw new WrongTypeParameters("email", "string", typeof email);
      }
      if (typeof password !== "string") {
        throw new WrongTypeParameters("password", "string", typeof password);
      }
      if (typeof acceptedTerms !== "boolean") {
        throw new WrongTypeParameters("acceptedTerms", "boolean", typeof acceptedTerms);
      }

      const response = await this.usecase.execute(name, email, password, acceptedTerms);

      const viewmodel = new SignUpViewmodel({
        email: response.userEmail,
        name: response.userName,
        username: response.userUsername,
        nickname: response.userNickname as string,
        roleType: response.userRoleType as ROLE_TYPE
      });

      return new Created(viewmodel.toJSON());
    } catch (error: any) {
      if (error instanceof MissingParameters || error instanceof WrongTypeParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message);
      }
      if (error instanceof DuplicatedItem) {
        return new BadRequest(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(`SignUpController, Error on handle: ${error.message}`);
      }
    }
  }
}