export class ReviewViewmodel {
  review: string;
  star: number;
  eventId: string;
  instituteId: string;
  reviewedAt: Date;
  username: string;
  nickname: string;
  profilePhoto?: string;

  constructor(review: string, star: number, eventId: string, instituteId: string, reviewedAt: Date, username: string, nickname: string, profilePhoto?: string) {
    this.review = review;
    this.star = star;
    this.eventId = eventId;
    this.instituteId = instituteId;
    this.reviewedAt = reviewedAt;
    this.username = username;
    this.nickname = nickname;
    this.profilePhoto = profilePhoto;
  }

  toJSON() {
    return {
      review: {
        comment: this.review,
        star: this.star,
        eventId: this.eventId,
        instituteId: this.instituteId,
      },
      user: {
        username: this.username,
        nickname: this.nickname,
        profilePhoto: this.profilePhoto
      }
    }
  }
}

export class GetAllReviewsByEventViewmodel {
  
    private reviews: ReviewViewmodel[];
  
    constructor(reviews: ReviewViewmodel[]) {
      this.reviews = reviews.map(review => new ReviewViewmodel(review.review, review.star, review.eventId, review.instituteId, review.reviewedAt, review.username, review.nickname, review.profilePhoto));
    }
  
    toJSON() {
      return {
        reviews: this.reviews.map(review => review.toJSON()),
        message: 'Comentários encontrados com sucesso'
      }
  
    }
}