export class GetAllFollowingViewModel {
    userId?: string;
    username: string;
    profilePhoto?: string;
  
    constructor(username: string, userId?: string, profilePhoto?: string) {
      this.userId = userId;
      this.username = username;
      this.profilePhoto = profilePhoto;
    }
  
    toJSON() {
      return {
        userId: this.userId,
        username: this.username,
        profilePhoto: this.profilePhoto,
      }
    }
  }