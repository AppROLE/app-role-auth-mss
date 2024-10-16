import { User } from "../entities/user";
import { PRIVACY_TYPE } from "../enums/privacy_enum";

export class UserMock {
  public users: User[];

  constructor() {
    this.users = [
      new User({
        name: "Matue",
        nickname: "matue",
        username: "matue30praum",
        email: "matue@30praum.com",
        linkInstagram: "https://instagram.com/matue30praum",
        linkTiktok: "https://tiktok.com/matue30praum",
        bgPhoto: "https://example.com/bgphoto1.jpg",
        profilePhoto: "https://example.com/profile1.jpg",
        privacy: PRIVACY_TYPE.PUBLIC,
        following: [
          { userFollowedId: "2", followedAt: new Date("2024-01-01") },
        ],
        favorites: [
          {
            instituteId: "1",
            favoritedAt: new Date("2024-01-10"),
          },
        ],
      }),
      new User({
        name: "User",
        nickname: "user",
        username: "user",
        email: "user@example.com",
        linkInstagram: "https://instagram.com/user",
        linkTiktok: "https://tiktok.com/user",
        bgPhoto: "https://example.com/bgphoto2.jpg",
        profilePhoto: "https://example.com/profile2.jpg",
        privacy: PRIVACY_TYPE.PRIVATE,
        following: [
          { userFollowedId: "3", followedAt: new Date("2024-01-02") },
        ],
        favorites: [
          {
            instituteId: "2",
            favoritedAt: new Date("2024-01-20"),
          },
        ],
      }),
      new User({
        name: "Lionel Messi",
        nickname: "Messi",
        username: "messi",
        email: "messi@adidas.com",
        linkInstagram: "https://instagram.com/messi",
        linkTiktok: "https://tiktok.com/messi",
        bgPhoto: "https://example.com/bgphoto3.jpg",
        profilePhoto: "https://example.com/profile3.jpg",
        privacy: PRIVACY_TYPE.PUBLIC,
        following: [
          { userFollowedId: "1", followedAt: new Date("2024-01-03") },
        ],
        favorites: [
          {
            instituteId: "3",
            favoritedAt: new Date("2024-01-30"),
          },
        ],
      }),
    ];
  }
}
