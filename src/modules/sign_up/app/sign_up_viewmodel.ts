import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";

interface SignUpViewmodelProps {
  name: string;
  email: string;
  roleType: ROLE_TYPE;
  nickname: string;
  username: string;
}

export class SignUpViewmodel {
  private readonly _name: string;
  private readonly _email: string;
  private readonly _roleType: ROLE_TYPE;
  private readonly _nickname: string;
  private readonly _username: string;

  constructor(props: SignUpViewmodelProps) {
    this._name = props.name;
    this._email = props.email;
    this._roleType = props.roleType;
    this._nickname = props.nickname;
    this._username = props.username;
  }

  toJSON() {
    return {
      name: this._name,
      email: this._email,
      roleType: this._roleType,
      nickname: this._nickname,
      username: this._username,
      message: "User created successfully",
    };
  }
}