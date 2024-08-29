import { Request, Response } from "express";
import {
  InvalidRequest,
  MissingParameters,
  WrongTypeParameters,
} from "../../../shared/helpers/errors/controller_errors";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  ParameterError,
} from "../../../shared/helpers/http/http_codes";
import { EntityError } from "../../../shared/helpers/errors/domain_errors";
import { ConfirmCodeUseCase } from "./confirm_code_usecase";

export class ForgotPasswordController {
  constructor(private readonly usecase: ConfirmCodeUseCase) {}

  async handle(req: Request, res: Response) {
    const { email, code } = req.body;

    if (!email) {
      throw new MissingParameters("email");
    }

    if (!code) {
      throw new MissingParameters("code");
    }

    try {
      const message = await this.usecase.execute(email, code);
      return res.status(200).json({ message });
    } catch (error: any) {
      if (error instanceof InvalidRequest) {
        return new BadRequest(error.message).send(res);
      }
      if (error instanceof EntityError) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof Forbidden) {
        return new Forbidden(error.getMessage()).send(res);
      }
      if (error instanceof MissingParameters) {
        return new ParameterError(error.message).send(res);
      }
      if (error instanceof WrongTypeParameters) {
        return new ParameterError(error.message).send(res);
      }
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
