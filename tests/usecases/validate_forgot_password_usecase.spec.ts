import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserRepoMock } from "../../src/shared/infra/repositories/user/user_repository_mock";
import { ValidateForgotPasswordCodeUseCase } from "../../src/modules/validate_forgot_password_code/app/validate_forgot_password_code_usecase";
import { EntityError } from "../../src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../src/shared/helpers/errors/usecase_errors";

describe("ValidateForgotPasswordCodeUseCase", () => {
  let userRepoMock: UserRepoMock;
  let validateForgotPasswordCodeUseCase: ValidateForgotPasswordCodeUseCase;

  beforeEach(() => {
    userRepoMock = new UserRepoMock();
    validateForgotPasswordCodeUseCase = new ValidateForgotPasswordCodeUseCase(
      userRepoMock
    );

    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should throw EntityError when email is not valid", async () => {
    const email = "semArroba.com";
    const code = "123456";

    await expect(
      validateForgotPasswordCodeUseCase.execute(email, code)
    ).rejects.toThrow(new EntityError("email"));
  });

  it("should throw EntityError when code is not valid", async () => {
    const email = "valid@exemplo.com";
    const code = "123";

    await expect(
      validateForgotPasswordCodeUseCase.execute(email, code)
    ).rejects.toThrow(new EntityError("code"));
  });

  it("should throw NoItemsFound when user is not found", async () => {
    const email = "30praum@30praum.com";
    const code = "123456";

    await expect(
      validateForgotPasswordCodeUseCase.execute(email, code)
    ).rejects.toThrow(new NoItemsFound("email"));
  });

  it("should return a success message when the code is valid", async () => {
    const email = userRepoMock.user_mock.users[0].userEmail;
    const code = "123456";
    const user = userRepoMock.user_mock.users[0];

    const result = await validateForgotPasswordCodeUseCase.execute(email, code);

    expect(result).toEqual({
      message: "Código validado com sucesso!",
      user,
      confirmationCode: code,
    });
  });
});
