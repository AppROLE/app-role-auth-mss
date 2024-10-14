import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { FinishSignUpUseCase } from "./finish_sign_up_usecase";
import { MissingParameters, WrongTypeParameters } from "src/shared/helpers/errors/controller_errors";
import { FinishSignUpViewmodel } from "./finish_sign_up_viewmodel";
import { BadRequest, InternalServerError, NotFound, OK } from "src/shared/helpers/external_interfaces/http_codes";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { DuplicatedItem, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class FinishSignUpController {
  constructor(private usecase: FinishSignUpUseCase) {}

  async handle(request: IRequest) {
    const email = request.data.email;
    const newUsername = request.data.username;
    let newNickname = request.data.nickname;
    const password = request.data.password;

    console.log('FINSIH SIGN UP CONTROLLER', email, newUsername, password, newNickname);

    if (!email) {
      throw new MissingParameters("email");
    }
    if (!newUsername) {
      throw new MissingParameters("username");
    }
    if (!password) {
      throw new MissingParameters("password");
    }


    if (typeof email !== "string") {
      throw new WrongTypeParameters("email", "string", typeof email);
    }
    if (typeof newUsername !== "string") {
      throw new WrongTypeParameters("username", "string", typeof newUsername);
    }
    if (typeof password !== "string") {
      throw new WrongTypeParameters("password", "string", typeof password);
    }
    if (newNickname && typeof newNickname !== "string") {
      throw new WrongTypeParameters("nickname", "string", typeof newNickname);
    }

    try {
      let resp;

      console.log('FINSIH SIGN UP CONTROLLER', email, newUsername.toLowerCase(), password, newNickname);

      resp = newNickname && typeof newNickname === 'string' ?
        await this.usecase.execute(email, newUsername.toLowerCase(), password, newNickname) :
        await this.usecase.execute(email, newUsername.toLowerCase(), password, undefined);

      const viewmodel = new FinishSignUpViewmodel(
        "Seu cadastro foi finalizado com sucesso!"
      );

      console.log('FINSIH SIGN UP CONTROLLER RESP: ', resp);

      console.log('FINSIH SIGN UP CONTROLLER VIEWMODEL: ', viewmodel.toJSON());

      return new OK(viewmodel.toJSON());
    } catch (error: any) {
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters ||
        error instanceof EntityError
      ) {
        return new BadRequest(error.message);
      }
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }
      if (error instanceof DuplicatedItem) {
        return new BadRequest(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(`Internal Server Error, error: ${error.message}`);
      }
    }
  }
}