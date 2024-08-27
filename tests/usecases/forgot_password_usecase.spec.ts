import { describe, it, expect, vi } from "vitest";
import { ForgotPasswordUseCase } from "../../src/modules/forgot_password/app/forgot_password_usecase";
import { UserRepoMock } from "../../src/shared/infra/mocks/user_repository_mock";
import { NoItemsFound } from "../../src/shared/helpers/errors/usecase_errors";
import { UserMock } from "../../src/shared/domain/mocks/user_mock";

describe("ForgotPasswordUseCase", () => {
  const userRepoMock = new UserRepoMock();
  const userMock = new UserMock();
  const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepoMock);

  it("should throw NoItemsFound when user is not found", async () => {
    const email = "nonexistent@example.com";
    userRepoMock.user_mock.users = [];

    vi.spyOn(userRepoMock, "getUserByEmail").mockResolvedValue(null);

    await expect(forgotPasswordUseCase.execute(email)).rejects.toThrow(
      NoItemsFound
    );
    expect(userRepoMock.getUserByEmail).toHaveBeenCalledWith(email);
  });

  it("should return a success message when user is found", async () => {
    const email = userMock.users[0].userEmail;

    vi.spyOn(userRepoMock, "getUserByEmail").mockResolvedValue({} as any); 
    vi.spyOn(userRepoMock, "forgotPassword").mockResolvedValue(
      `A password reset link has been sent to ${email}.`
    );

    const result = await forgotPasswordUseCase.execute(email);

    expect(result).toBe(`A password reset link has been sent to ${email}.`);
  });
});
