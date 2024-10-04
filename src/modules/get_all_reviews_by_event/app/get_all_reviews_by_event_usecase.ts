import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";

export class GetAllReviewsByEventUseCase {
  constructor(
    private readonly userRepo: IUserRepository 
  ) {}

  async execute(eventId: string) {
    const reviews = await this.userRepo.getAllReviewsByEvent(eventId);
    if (reviews.length === 0) return [];

      const reviewsTransformed = reviews.map(review => {
        const reviewsFromUser = review.userReviews.map(userReview => {
          return {
            star: userReview.star,
            comment: userReview.review,
            reviewedAt: userReview.reviewedAt,
            instituteId: userReview.instituteId,
            eventId: userReview.eventId
          }
        })

        const user = {
          username: review.userUsername,
          nickname: review.userNickname,
          profilePhoto: review.userProfilePhoto
        }

        return {
          reviews: reviewsFromUser,
          user
        }
      })

      return reviewsTransformed;
    
  }
}