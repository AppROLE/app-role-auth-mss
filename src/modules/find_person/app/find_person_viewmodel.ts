export class PersonViewmodel {
  profilePhoto?: string;
  username: string;
  nickname: string;

  constructor(username: string, nickname: string, profilePhoto?: string) {
    this.profilePhoto = profilePhoto;
    this.username = username;
    this.nickname = nickname;
  }

  toJSON() {
    return {
      profilePhoto: this.profilePhoto,
      username: this.username,
      nickname: this.nickname,
    };
  }
}

export class FindPersonViewmodel {
  persons: PersonViewmodel[];

  constructor(persons: PersonViewmodel[]) {
    this.persons = persons;
  }

  toJSON() {
    return {
      users: this.persons.map((person) => person.toJSON()),
      message: 'Usuários encontrados com sucesso',
    }
  }
}