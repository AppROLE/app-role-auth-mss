import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { IUser } from "../database/models/user.model";
import { FavoriteProps, FollowingProps, ReviewProps, User } from "src/shared/domain/entities/user";
import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";
import { IUser as UserDocument } from "../database/models/user.model";

export interface UserMongoDTOProps {
  _id: string;
  name: string;
  email: string;
  nickname: string;
  username: string;
  roleType: ROLE_TYPE;
  phoneNumber?: string;
  linkInstagram?: string;
  linkTiktok?: string;
  backgroundPhoto?: string;
  profilePhoto?: string;
  privacy: PRIVACY_TYPE
  following: FollowingProps[];
  favorites: FavoriteProps[];
  reviews: ReviewProps[];
}

export class UserMongoDTO {
  private _id: string;
  private name: string;
  private email: string;
  private nickname: string;
  private username: string;
  private roleType: ROLE_TYPE;
  private phoneNumber?: string;
  private linkInstagram?: string;
  private linkTiktok?: string;
  private backgroundPhoto?: string;
  private profilePhoto?: string;
  private privacy: PRIVACY_TYPE
  private following: FollowingProps[];
  private favorites: FavoriteProps[];
  private reviews: ReviewProps[];

  constructor(props: UserMongoDTOProps) {
    this._id = props._id;
    this.name = props.name;
    this.email = props.email;
    this.nickname = props.nickname;
    this.username = props.username;
    this.roleType = props.roleType;
    this.phoneNumber = props.phoneNumber;
    this.linkInstagram = props.linkInstagram;
    this.linkTiktok = props.linkTiktok;
    this.backgroundPhoto = props.backgroundPhoto;
    this.profilePhoto = props.profilePhoto;
    this.privacy = props.privacy;
    this.following = props.following;
    this.favorites = props.favorites;
    this.reviews = props.reviews;
  }

  static fromMongo(userDoc: IUser): UserMongoDTO {
    const userObject = userDoc.toObject();

    return new UserMongoDTO({
      _id: userObject._id,
      name: userObject.name,
      email: userObject.email,
      nickname: userObject.nickname,
      username: userObject.username,
      roleType: userObject.roleType,
      phoneNumber: userObject.phoneNumber,
      linkInstagram: userObject.linkInstagram,
      linkTiktok: userObject.linkTiktok,
      backgroundPhoto: userObject.bg_photo,
      profilePhoto: userObject.profile_photo,
      privacy: userObject.privacy,
      following: userObject.following,
      favorites: userObject.favorites,
      reviews: userObject.reviews,
    });
  }

  static toEntity(userMongoDTO: UserMongoDTO): User {
    return new User({
      user_id: userMongoDTO._id,
      name: userMongoDTO.name,
      nickname: userMongoDTO.nickname,
      username: userMongoDTO.username,
      email: userMongoDTO.email,
      roleType: userMongoDTO.roleType,
      phoneNumber: userMongoDTO.phoneNumber,
      linkInstagram: userMongoDTO.linkInstagram,
      linkTiktok: userMongoDTO.linkTiktok,
      bgPhoto: userMongoDTO.backgroundPhoto,
      profilePhoto: userMongoDTO.profilePhoto,
      privacy: userMongoDTO.privacy,
      following: userMongoDTO.following.map(following => ({
        userFollowedId: following.userFollowedId,
        followedAt: following.followedAt
      })),
      favorites: userMongoDTO.favorites.map(favorite => ({
        instituteId: favorite.instituteId,
        eventId: favorite.eventId,
        favoritedAt: favorite.favoritedAt,
      })),
      reviews: userMongoDTO.reviews.map(review => ({
        instituteId: review.instituteId,
        star: review.star,
        review: review.review,
        reviewedAt: review.reviewedAt
      }))
    })
  }

  static fromEntity(user: User): UserMongoDTO {
    return new UserMongoDTO({
      _id: user.userId as string,
      name: user.userName,
      email: user.userEmail,
      nickname: user.userNickname as string,
      username: user.userUsername,
      roleType: user.userRoleType as ROLE_TYPE,
      phoneNumber: user.userPhoneNumber,
      linkInstagram: user.userlinkInstagram,
      linkTiktok: user.userlinkTiktok,
      backgroundPhoto: user.userBgPhoto,
      profilePhoto: user.userProfilePhoto,
      privacy: user.userPrivacy as PRIVACY_TYPE,
      following: user.userFollowing.map(following => ({
        userFollowedId: following.userFollowedId,
        followedAt: following.followedAt
      })),
      favorites: user.userFavorites.map(favorite => ({
        instituteId: favorite.instituteId,
        eventId: favorite.eventId,
        favoritedAt: favorite.favoritedAt
      })),
      reviews: user.userReviews.map(review => ({
        instituteId: review.instituteId,
        star: review.star,
        review: review.review,
        reviewedAt: review.reviewedAt
      }))
    });
  }

  static toMongo(userMongoDTO: UserMongoDTO): UserDocument {
    return {
      _id: userMongoDTO._id,
      name: userMongoDTO.name,
      email: userMongoDTO.email,
      nickname: userMongoDTO.nickname,
      username: userMongoDTO.username,
      lnk_instagram: userMongoDTO.linkInstagram,
      lnk_tiktok: userMongoDTO.linkTiktok,
      bg_photo: userMongoDTO.backgroundPhoto,
      profile_photo: userMongoDTO.profilePhoto,
      privacy: userMongoDTO.privacy,
      following: userMongoDTO.following.map(following => ({
        user_followed_id: following.userFollowedId,
        followed_at: following.followedAt
      })),
      favorites: userMongoDTO.favorites.map(favorite => ({
        institute_id: favorite.instituteId,
        event_id: favorite.eventId,
        favorited_at: favorite.favoritedAt
      })),
      reviews: userMongoDTO.reviews.map(review => ({
        institute_id: review.instituteId,
        star: review.star,
        review: review.review,
        reviewed_at: review.reviewedAt
      })),
      created_at: new Date(),
    } as UserDocument;
  }

}