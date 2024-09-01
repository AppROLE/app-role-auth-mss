import { BaseError } from "./base_error";

export class MissingParameters extends BaseError {
  constructor(message: string) {
    super(`O campo ${message} está faltando.`);
  }
}

export class WrongTypeParameters extends BaseError {
  constructor(
    fieldName: string,
    fieldTypeExpected: string,
    fieldTypeReceived: string
  ) {
    super(
      `O campo ${fieldName} não possui o tipo correto.\n Recebido: ${fieldTypeReceived}.\n Experado: ${fieldTypeExpected}.`
    );
  }
}
