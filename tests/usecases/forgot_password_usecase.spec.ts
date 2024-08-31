import { describe, it, expect, vi, beforeEach } from "vitest";
import { ForgotPasswordUseCase } from "../../src/modules/forgot_password/app/forgot_password_usecase";
import { UserRepoMock } from "../../src/shared/infra/repositories/user/user_repository_mock";
import { MailRepositoryMock } from "../../src/shared/infra/repositories/mail/mail_repository_mock";

describe("ForgotPasswordUseCase", () => {
  let userRepoMock: UserRepoMock;
  let mailRepositoryMock: MailRepositoryMock;
  let forgotPasswordUseCase: ForgotPasswordUseCase;

  beforeEach(() => {
    userRepoMock = new UserRepoMock();
    mailRepositoryMock = new MailRepositoryMock();
    forgotPasswordUseCase = new ForgotPasswordUseCase(
      userRepoMock,
      mailRepositoryMock
    );

    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should throw NoItemsFound when user is not found", async () => {
    const email = "nonexistent@example.com";
    vi.spyOn(userRepoMock, "getUserByEmail").mockResolvedValue(null);

    await expect(forgotPasswordUseCase.execute(email)).rejects.toThrow(
      "No items found for this email"
    );
    expect(userRepoMock.getUserByEmail).toHaveBeenCalledWith(email);
  });

  it("should throw EntityError when user email is not valid", async () => {
    const email = "nonexistentexample.com";

    await expect(forgotPasswordUseCase.execute(email)).rejects.toThrow(
      "Field email is not valid"
    );
  });

  it("should return a success message when user is found", async () => {
    const email = userRepoMock.user_mock.users[0].userEmail;
    const user = userRepoMock.user_mock.users[0];
    vi.spyOn(userRepoMock, "getUserByEmail").mockResolvedValue(user);
    vi.spyOn(userRepoMock, "forgotPassword").mockResolvedValue(
      `A password reset link has been sent to ${email}.`
    );
    vi.spyOn(mailRepositoryMock, "sendMail").mockResolvedValue(undefined);

    const result = await forgotPasswordUseCase.execute(email);

    expect(result).toEqual({
      message: "E-mail de recuperação enviado com sucesso",
    });
    expect(userRepoMock.getUserByEmail).toHaveBeenCalledWith(email);
    expect(userRepoMock.forgotPassword).toHaveBeenCalledWith(
      email,
      expect.any(String)
    );
    expect(mailRepositoryMock.sendMail).toHaveBeenCalledWith(
      email,
      "Recuperação de Senha",
      expect.stringContaining("Codigo de recuperacao:")
    );
  });
});
