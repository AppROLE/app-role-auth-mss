import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";

export class GetAllReviewsByEventUseCase {
  constructor(
    private readonly userRepo: IUserRepository 
  ) {}

  async execute(eventId: string) {
    const reviews = await this.userRepo.getAllReviewsByEvent(eventId);
    if (reviews.length === 0) return [];

    const reviewsTransformed = reviews.map((review) => {
      return {
        comment: review.userReviews[0].review,
        username: review.userUsername,
        profilePhoto: review.userProfilePhoto,
        star: review.userReviews[0].star,
        reviewedAt: review.userReviews[0].reviewedAt,
        nickname: review.userNickname
      }
    });

      return reviewsTransformed;
    
  }
}