export class GetProfileViewmodel {
  userId: string
  name: string
  username: string
  linkTiktok?: string
  linkInstagram?: string
  following: number
  followers: number

  constructor(
    userId: string,
    name: string,
    username: string,
    following: number,
    followers: number,
    linkTiktok?: string,
    linkInstagram?: string
  ) {
    this.userId = userId
    this.name = name
    this.username = username
    this.following = following
    this.followers = followers
    this.linkTiktok = linkTiktok
    this.linkInstagram = linkInstagram
  }

  toJSON() {
    return {
      userId: this.userId,
      name: this.name,
      username: this.username,
      linkTiktok: this.linkTiktok,
      linkInstagram: this.linkInstagram,
      following: this.following,
      followers: this.followers
    }
  }

}