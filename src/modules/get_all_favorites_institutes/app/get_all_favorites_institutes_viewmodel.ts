import { User, FavoriteProps } from "src/shared/domain/entities/user";

export class InstituteViewModel {
  private instituteIds: string[];

  constructor(user: User) {
    this.instituteIds = user.userFavorites.map((favorite: FavoriteProps) => favorite.instituteId);
  }

  toJSON() {
    return {
      instituteIds: this.instituteIds,
    };
  }
}

export class GetAllFavoritesInstitutesViewModel {
  private events: InstituteViewModel[];

  constructor(users: User[]) {
    this.events = users.map((user) => new InstituteViewModel(user));
  }

  toJSON() {
    return {
      events: this.events.map((event) => event.toJSON()),
      message: "Todos os eventos foram retornados com sucesso",
    };
  }
}