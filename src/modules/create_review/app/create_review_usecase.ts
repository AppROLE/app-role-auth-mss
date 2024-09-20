import { IUserRepository } from "src/shared/domain/irepositories/user_repository_interface";
import { EntityError } from "src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";

export class CreateReviewUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(
    star: number,
    review: string,
    reviewedAt: number,
    instituteId: string,
    username: string
  ) {
    if (star < 0 || star > 5) {
      throw new EntityError("star");
    }
    if (review.length < 5 || review.length > 250) {
      throw new EntityError("review");
    }
    if (reviewedAt < 0) {
      throw new EntityError("reviewedAt");
    }
    if (instituteId.length < 1 || instituteId.trim() === "") {
      throw new EntityError("instituteId");
    }

    const reviewedAtDate = new Date(reviewedAt);

    await this.userRepo.findByUsername(username);

    await this.userRepo.createReview(
      star,
      review,
      reviewedAtDate,
      instituteId,
      username
    );

  }
}