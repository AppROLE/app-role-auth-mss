import { BaseError } from "./base_error";

export class NoItemsFound extends BaseError {
  constructor(message: string) {
    super(`Nenhum item foi encontrado para ${message}`);
  }
}

export class DuplicatedItem extends BaseError {
  constructor(message: string) {
    super(`Item já existente para ${message}`);
  }
}

export class ForbiddenAction extends BaseError {
  constructor(message: string) {
    super(`The action is forbidden for this ${message}`);
  }
}

export class ConflictItems extends BaseError {
  constructor(message: string) {
    super(`Conflict items for ${message}`);
  }
}

export class FailToSendEmail extends BaseError {
  constructor(message: string) {
    super(`Falha ao enviar o email ${message}`);
  }
}
