import { IRequest } from "src/shared/helpers/external_interfaces/external_interface";
import { RefreshTokenUseCase } from "./refresh_token_usecase";
import { MissingParameters, WrongTypeParameters } from "src/shared/helpers/errors/controller_errors";
import { ForbiddenAction } from "src/shared/helpers/errors/usecase_errors";
import { BadRequest, InternalServerError, OK, Unauthorized } from "src/shared/helpers/external_interfaces/http_codes";

export class RefreshTokenController {
  constructor(private readonly usecase: RefreshTokenUseCase) {}

  async handle(request: IRequest) {
    try {
      const bearerToken = request.data.Authorization;

      if (!bearerToken) {
        throw new MissingParameters("token");
      }
      if (typeof bearerToken !== "string") {
        throw new WrongTypeParameters("token", "string", typeof bearerToken);
      }
      const refreshToken = bearerToken.split(" ")[1];

      const { accessToken, refreshToken: newRefreshToken, idToken } = await this.usecase.execute(refreshToken);
      return new OK({ accessToken, refreshToken: newRefreshToken, idToken });
    } catch (error: any) {
      if (error instanceof MissingParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof WrongTypeParameters) {
        return new BadRequest(error.message);
      }
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }
      if (error instanceof Error) {
        return new InternalServerError(`RefreshTokenController, Error on handle: ${error.message}`);
      }
    }
  }
}