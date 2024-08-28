import { Request, Response } from "express";

import { ForgotPasswordUseCase } from "./forgot_password_usecase";
import {
  InvalidRequest,
  MissingParameters,
} from "../../../shared/helpers/errors/controller_errors";
import { ConflictItems } from "../../../shared/helpers/errors/usecase_errors";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  ParameterError,
} from "../../../shared/helpers/http/http_codes";
import { EntityError } from "../../../shared/helpers/errors/domain_errors";

export class ForgotPasswordController {
  constructor(private readonly usecase: ForgotPasswordUseCase) {}

  async handle(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      throw new MissingParameters("email");
    }

    try {
      const message = await this.usecase.execute(email);
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
      return new InternalServerError("Internal Server Error").send(res);
    }
  }
}
