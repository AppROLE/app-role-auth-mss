import { MissingParameters, WrongTypeParameters } from "src/shared/helpers/errors/controller_errors";
import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";

export class SignUpController {
  constructor(private readonly usecase: SignUpUsecase) {}

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
    } catch (error: any) {}
  }
}