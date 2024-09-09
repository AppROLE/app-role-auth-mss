export class UserAPIGatewayDTO {
  userId: string
  username: string

  constructor(userId: string, username: string) {
    this.userId = userId
    this.username = username
  }

  static fromAPIGateway(data: Record<string, any>): UserAPIGatewayDTO {
    console.log('data FROM API GATEWAY ', data)
    return new UserAPIGatewayDTO(data['sub'], data['cognito:username'])
  }

  getParsedData() {
    return {
      userId: this.userId,
      username: this.username
    }
  }
}