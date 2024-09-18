export class UserAPIGatewayDTO {
  userId: string
  username: string
  email: string

  constructor(userId: string, username: string, email: string) {
    this.userId = userId
    this.username = username
    this.email = email
  }

  static fromAPIGateway(data: Record<string, any>): UserAPIGatewayDTO {
    console.log('data FROM API GATEWAY ', data)
    return new UserAPIGatewayDTO(data['sub'], data['cognito:username'], data['email'])
  }

  getParsedData() {
    return {
      userId: this.userId,
      username: this.username,
      email: this.email
    }
  }
}