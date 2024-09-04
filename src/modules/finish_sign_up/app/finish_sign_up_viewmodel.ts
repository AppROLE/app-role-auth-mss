export class FinishSignUpViewmodel {
  access_token: string;
  id_token: string;
  refresh_token: string;
  user_id?: string;

  constructor(
    access_token: string,
    id_token: string,
    refresh_token: string,
    user_id?: string
  ) {
    this.access_token = access_token;
    this.id_token = id_token;
    this.refresh_token = refresh_token;
    this.user_id = user_id;
  }

  toJSON(): object {
    return {
      access_token: this.access_token,
      id_token: this.id_token,
      refresh_token: this.refresh_token,
      user_id: this.user_id,
    };
  }
}
