// import { User } from 'src/shared/domain/entities/user';

// export class UserCognitoDTO {
//     user_id?: string;
//     username: string;
//     nickname: string;
//     name: string;
//     email: string;
//     password?: string;
//     accepted_terms: boolean | undefined;

//     static TO_COGNITO_DICT: Record<string, string> = {
//         "user_id": "sub",
//         "name": "name",
//         "email": "email",
//         "nickname": "nickname",
//         "confirmationCode": "custom:confirmationCode",
//         "password": "password",
//         "accepted_terms": "custom:acceptedTerms",
//     };

//     static FROM_COGNITO_DICT: Record<string, string> = Object.assign(
//         {},
//         Object.fromEntries(Object.entries(UserCognitoDTO.TO_COGNITO_DICT).map(([key, value]) => [value, key])),
//         { "sub": "user_id" }
//     );

//     constructor(
//       email: string,
//       name: string,
//       username: string,
//       nickname: string,
//       user_id: string,
//         password?: string,
//         accepted_terms?: boolean,
//         accepted_notifications_email?: boolean
//     ) {
//         console.log('CHEGOU NO INIT DO USER COGNITO DTO');
//         this.user_id = user_id;
//         this.name = name;
//         this.email = email;
//         this.username = username;
//         this.nickname = nickname;
//         this.password = password;
//         this.accepted_terms = accepted_terms;
//         console.log('CHEGOU NO FIM INIT DO USER COGNITO DTO');
//     }

//     static fromEntity(user: User): UserCognitoDTO {
//         return new UserCognitoDTO(
//           user.email,
//           user.name,
//           user.phone,
//           user.user_id,
//           user.password,
//             user.accepted_terms,
//             user.accepted_notifications_email
//         );
//     }

//     toCognitoAttributes(): Array<Record<string, string>> {
//         console.log('CHEGOU NO TO COGNITO ATTRIBUTES');
//         let user_attributes = Object.keys(UserCognitoDTO.TO_COGNITO_DICT).map((att) =>
//             UserCognitoDTO.parseAttribute(UserCognitoDTO.TO_COGNITO_DICT[att], (this as any)[att])
//         );
//         console.log('CHEGOU NO TO COGNITO ATTRIBUTES 2', user_attributes);
//         user_attributes = user_attributes.filter((att) => att["Value"] !== 'None' && att["Value"] !== '');
//         console.log('CHEGOU NO TO COGNITO ATTRIBUTES 3', user_attributes);
//         return user_attributes;
//     }

//     static fromCognito(data: Record<string, any>): UserCognitoDTO {
//         const user_data = (data["Attributes"] || []).reduce((acc: Record<string, any>, att: Record<string, any>) => {
//             const key = UserCognitoDTO.FROM_COGNITO_DICT[att["Name"]];
//             if (key) {
//                 acc[key] = att["Value"];
//             }
//             return acc;
//         }, {});

//         user_data["created_at"] = data["UserCreateDate"];
//         user_data["updated_at"] = data["UserLastModifiedDate"];
//         user_data['pagination_token'] = data['PaginationToken'];

//         console.log('USER DATA FROM COGNITO:', user_data);

//         return new UserCognitoDTO(
//             user_data["user_id"],
//             user_data["email"],
//             user_data["name"],
//             user_data["phone"],
//             undefined,
//             user_data["accepted_terms"] === 'True',
//             user_data["accepted_notifications_email"] === 'True'
//         );
//     }

//     toEntity(): User {
//         console.log('CHEGOU NO TO ENTITY');
//         console.log('SELF:', JSON.stringify(this));
//         return new User(
//             this.user_id,

//             this.name,
//             this.email,
//             this.phone,
//             undefined,
//             this.accepted_terms,
//             this.accepted_notifications_email
//         );
//     }

//     equals(other: UserCognitoDTO): boolean {
//         return this.user_id === other.user_id &&
//             this.email === other.email &&
//             this.name === other.name &&
//             this.password === other.password &&
//             this.accepted_terms === other.accepted_terms &&
//             this.accepted_notifications_email === other.accepted_notifications_email &&
//             this.phone === other.phone;
//     }

//     static parseAttribute(name: string, value: any): Record<string, string> {
//         return { 'Name': name, 'Value': String(value) };
//     }

//     toDict(): Record<string, any> {
//         return {
//             'user_id': this.user_id,
//             'name': this.name,
//             'email': this.email,
//             'phone': this.phone,
//             'password': this.password,
//             'accepted_terms': this.accepted_terms,
//             'accepted_notifications_email': this.accepted_notifications_email,
//         };
//     }
// }



// /*
//     A arrumar

// */
