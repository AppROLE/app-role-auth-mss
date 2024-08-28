import { EntityError } from "../../helpers/errors/domain_errors";

interface UserProps {
  name: string;
  nickname: string;
  username: string;
  email: string;
  createdAt?: Date;
  linkInstagram?: string;
  linkTiktok?: string;
  bgPhoto?: string;
  profilePhoto?: string;
  privacy?: string;
  following?: FollowingProps[];
  favorites?: FavoriteProps[];
  reviews?: ReviewProps[];
}

interface FollowingProps {
  userFollowedId: string;
  followedAt?: Date;
}

interface FavoriteProps {
  instituteId: string;
  eventId: string;
  favoritedAt?: Date;
}

interface ReviewProps {
  instituteId: string;
  star: number;
  review: string;
  reviewedAt?: Date;
}

export class User {
  private readonly user_id?: string;
  private readonly name: string;
  private readonly username: string;
  private readonly email: string;
  private readonly created_at: Date;
  private readonly link_instagram?: string;
  private readonly link_tiktok?: string;
  private readonly bg_photo?: string;
  private readonly profile_photo?: string;
  private readonly privacy?: string;
  private readonly following: FollowingProps[];
  private readonly favorites: FavoriteProps[];
  private readonly reviews: ReviewProps[];

  constructor(props: UserProps) {
    this.validate(props);

    this.name = props.name;
    this.username = props.username;
    this.email = props.email;
    this.created_at = props.createdAt || new Date();
    this.link_instagram = props.linkInstagram;
    this.link_tiktok = props.linkTiktok;
    this.bg_photo = props.bgPhoto;
    this.profile_photo = props.profilePhoto;
    this.privacy = props.privacy;
    this.following = props.following || [];
    this.favorites = props.favorites || [];
    this.reviews = props.reviews || [];
  }

  get userId(): string | undefined {
    return this.user_id;
  }

  get userName(): string {
    return this.name;
  }

  get userUsername(): string {
    return this.username;
  }

  get userEmail(): string {
    return this.email;
  }

  get userCreatedAt(): Date {
    return this.created_at;
  }

  get userlinkInstagram(): string | undefined {
    return this.link_instagram;
  }

  get userlinkTiktok(): string | undefined {
    return this.link_tiktok;
  }

  get userBgPhoto(): string | undefined {
    return this.bg_photo;
  }

  get userProfilePhoto(): string | undefined {
    return this.profile_photo;
  }

  get userPrivacy(): string | undefined {
    return this.privacy;
  }

  get userFollowing(): FollowingProps[] {
    return this.following;
  }

  get userFavorites(): FavoriteProps[] {
    return this.favorites;
  }

  get userReviews(): ReviewProps[] {
    return this.reviews;
  }

  private validate(props: UserProps): void {
    User.validateName(props.name);
    User.validateUsername(props.username);
    User.validateEmail(props.email);
    User.validateInstagram(props.linkInstagram);
    User.validateTiktok(props.linkTiktok);
    User.validateBgPhoto(props.bgPhoto);
    User.validateProfilePhoto(props.profilePhoto);
    User.validatePrivacy(props.privacy);
    User.validateFollowing(props.following);
    User.validateFavorites(props.favorites);
    User.validateReviews(props.reviews);
  }

  static validateName(name: string): void {
    if (!name || name.trim().length === 0 || name.trim().length > 100) {
      throw new EntityError("Invalid name");
    }
  }

  static validateUsername(username: string): void {
    if (
      !username ||
      username.trim().length === 0 ||
      username.trim().length > 50
    ) {
      throw new EntityError("Invalid username");
    }
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new EntityError("Invalid email");
    }
    return true;
  }

  static validateInstagram(linkInstagram?: string): void {
    if (linkInstagram && linkInstagram.trim().length > 255) {
      throw new EntityError("Invalid Instagram link");
    }
  }

  static validateTiktok(linkTiktok?: string): void {
    if (linkTiktok && linkTiktok.trim().length > 255) {
      throw new EntityError("Invalid TikTok link");
    }
  }

  static validateBgPhoto(bgPhoto?: string): void {
    if (bgPhoto && bgPhoto.trim().length > 255) {
      throw new EntityError("Invalid background photo URL");
    }
  }

  static validateProfilePhoto(profilePhoto?: string): void {
    if (profilePhoto && profilePhoto.trim().length > 255) {
      throw new EntityError("Invalid profile photo URL");
    }
  }

  static validatePrivacy(privacy?: string): void {
    if (privacy && privacy.trim().length > 50) {
      throw new EntityError("Invalid privacy setting");
    }
  }

  static validateFollowing(following?: FollowingProps[]): void {
    if (following && !Array.isArray(following)) {
      throw new EntityError("Invalid following list");
    }
    following?.forEach((f) => {
      if (!f.userFollowedId || f.userFollowedId.trim().length === 0) {
        throw new EntityError("Invalid user followed ID in following list");
      }
    });
  }

  static validateFavorites(favorites?: FavoriteProps[]): void {
    if (favorites && !Array.isArray(favorites)) {
      throw new EntityError("Invalid favorites list");
    }
    favorites?.forEach((f) => {
      if (!f.instituteId || f.instituteId.trim().length === 0) {
        throw new EntityError("Invalid institute ID in favorites list");
      }
      if (!f.eventId || f.eventId.trim().length === 0) {
        throw new EntityError("Invalid event ID in favorites list");
      }
    });
  }

  static validateReviews(reviews?: ReviewProps[]): void {
    if (reviews && !Array.isArray(reviews)) {
      throw new EntityError("Invalid reviews list");
    }
    reviews?.forEach((r) => {
      if (!r.instituteId || r.instituteId.trim().length === 0) {
        throw new EntityError("Invalid institute ID in reviews list");
      }
      if (!r.star || r.star < 1 || r.star > 5) {
        throw new EntityError("Invalid star rating in reviews list");
      }
      if (
        !r.review ||
        r.review.trim().length === 0 ||
        r.review.trim().length > 1000
      ) {
        throw new EntityError("Invalid review text in reviews list");
      }
    });
  }
}
