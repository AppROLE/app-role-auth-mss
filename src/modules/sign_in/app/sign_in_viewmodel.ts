export class SignInViewModel {
  accessToken: string;
  idToken: string;
  refreshToken: string;

  constructor(
    accessToken: string,
    idToken: string,
    refreshToken: string,
  ) {
    this.accessToken = accessToken;
    this.idToken = idToken;
    this.refreshToken = refreshToken;
  }

  toJSON(): object {
    return {
      accessToken: this.accessToken,
      idToken: this.idToken,
      refreshToken: this.refreshToken,
    };
  }
}
