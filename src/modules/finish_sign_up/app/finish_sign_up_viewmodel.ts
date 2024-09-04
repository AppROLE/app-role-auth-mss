export class FinishSignUpViewmodel {
  message: string;

  constructor(
    message: string,
  ) {
    this.message = message;
  }

  toJSON(): object {
    return {
      message: this.message,
    };
  }
}
