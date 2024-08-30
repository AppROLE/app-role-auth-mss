import { UserRepoMock } from "./repositories/user/user_repository_mock";
import { UserRepositoryMongo } from "./database/repositories/user_repository_mongo";

class RepositoryProps {
  user_repo?: boolean = false;
}

export class Repository {
  public UserRepo: UserRepositoryMongo | UserRepoMock;

  constructor(props: RepositoryProps) {
    if (props.user_repo) {
      this.UserRepo = new UserRepositoryMongo();
    } else {
      this.UserRepo = new UserRepoMock();
    }
  }
}
