export class GetProfileViewmodel {
  userId: string
  nickname: string
  biography: string | undefined
  username: string
  profilePhoto?: string
  privacy: string
  bgPhoto?: string
  linkTiktok?: string
  linkInstagram?: string
  following: number
  followers: number

  constructor(
    userId: string,
    nickname: string,
    username: string,
    following: number,
    followers: number,
    privacy: string,
    biography?: string | undefined,
    profilePhoto?: string,
    bgPhoto?: string,
    linkTiktok?: string,
    linkInstagram?: string
  ) {
    this.userId = userId
    this.nickname = nickname
    this.username = username
    this.following = following
    this.privacy = privacy
    this.followers = followers
    this.linkTiktok = linkTiktok
    this.bgPhoto = bgPhoto
    this.profilePhoto = profilePhoto
    this.biography = biography
    this.linkInstagram = linkInstagram
  }

  toJSON() {
    return {
      userId: this.userId,
      nickname: this.nickname,
      username: this.username,
      linkTiktok: this.linkTiktok,
      linkInstagram: this.linkInstagram,
      backgroundPhoto: this.bgPhoto,
      profilePhoto: this.profilePhoto,
      privacy: this.privacy,
      biography: this.biography,
      following: this.following,
      followers: this.followers
    }
  }

}