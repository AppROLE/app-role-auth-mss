import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserRepoMock } from "../../src/shared/infra/repositories/user/user_repository_mock";
import { ChangePasswordUseCase } from "../../src/modules/change_password/app/change_password_usecase";
import { EntityError } from "../../src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../src/shared/helpers/errors/usecase_errors";

describe("ChangePasswordUseCase", () => {
  let userRepoMock: UserRepoMock;
  let changePasswordUseCase: ChangePasswordUseCase;

  beforeEach(() => {
    userRepoMock = new UserRepoMock();
    changePasswordUseCase = new ChangePasswordUseCase(userRepoMock);

    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should throw EntityError when email is not valid", async () => {
    const email = "semarroba.com";
    const newPassword = "AIAIAI123!";

    await expect(
      changePasswordUseCase.execute(email, newPassword)
    ).rejects.toThrow(new EntityError("email"));
  });

  it("should throw EntityError when newPassword is not valid", async () => {
    const email = "teste@teste.com";
    const newPassword = "teste"; 

    await expect(
      changePasswordUseCase.execute(email, newPassword)
    ).rejects.toThrow(new EntityError("password"));
  });

  it("should throw NoItemsFound when user is not found", async () => {
    const email = "nonexistent@example.com";
    const newPassword = "Validada123!";

    await expect(
      changePasswordUseCase.execute(email, newPassword)
    ).rejects.toThrow(new NoItemsFound("email"));
  });

  it("should return a success message when the password is changed successfully", async () => {
    const email = userRepoMock.user_mock.users[0].userEmail;
    const newPassword = "Validada123!";

    const setUserPasswordSpy = vi.spyOn(userRepoMock, "setUserPassword");

    const result = await changePasswordUseCase.execute(email, newPassword);

    expect(result).toEqual({
      message: "Senha redefinida com sucesso!",
    });
    expect(setUserPasswordSpy).toHaveBeenCalledWith(email, newPassword);
  });
});
