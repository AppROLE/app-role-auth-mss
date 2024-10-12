export type GetProfileReturnType = {
  userId: string
  name: string
  username: string
  linkTiktok?: string
  linkInstagram?: string
  biography: string | undefined
  profilePhoto: string | undefined
  backgroundPhoto: string | undefined
  privacy: string
  following: number
  followers: number
}