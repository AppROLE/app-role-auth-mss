export class FriendViewmodel {
  userId: string;
  username: string;
  profilePhoto?: string;
  nickname: string;

  constructor(userId: string, username: string, nickname: string, profilePhoto?: string) {
    this.userId = userId;
    this.username = username;
    this.profilePhoto = profilePhoto;
    this.nickname = nickname;
  }

  toJSON() {
    return {
      userId: this.userId,
      username: this.username,
      profilePhoto: this.profilePhoto,
      nickname: this.nickname
    }
  }
}


export class GetFriendsViewmodel {

  private friends: FriendViewmodel[];

  constructor(friends: FriendViewmodel[]) {
    this.friends = friends.map(friend => new FriendViewmodel(friend.userId, friend.username, friend.nickname, friend.profilePhoto));
  }

  toJSON() {
    return {
      friends: this.friends.map(friend => friend.toJSON()),
      message: 'Amigos encontrados com sucesso'
    }

  }
  
}