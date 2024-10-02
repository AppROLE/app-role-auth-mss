export type GetProfileReturnType = {
  userId: string
  name: string
  username: string
  linkTiktok?: string
  linkInstagram?: string
  biography: string | undefined
  following: number
  followers: number
}