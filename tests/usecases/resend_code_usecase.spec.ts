import { describe, it, expect, vi, beforeEach } from "vitest";
import { ResendCodeUseCase } from "../../src/modules/resend_code/app/resend_code_usecase";
import { UserRepoMock } from "../../src/shared/infra/repositories/auth/auth_repository_mock";
import { MailRepositoryMock } from "../../src/shared/infra/repositories/mail/mail_repository_mock";
import { EntityError } from "../../src/shared/helpers/errors/domain_errors";
import { NoItemsFound } from "../../src/shared/helpers/errors/usecase_errors";

describe("ResendCodeUseCase", () => {
  let userRepoMock: UserRepoMock;
  let mailRepositoryMock: MailRepositoryMock;
  let resendCodeUseCase: ResendCodeUseCase;

  beforeEach(() => {
    userRepoMock = new UserRepoMock();
    mailRepositoryMock = new MailRepositoryMock();
    resendCodeUseCase = new ResendCodeUseCase(userRepoMock, mailRepositoryMock);

    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should throw EntityError when user email is not valid", async () => {
    const invalidEmail = "invalid-email.com";

    await expect(resendCodeUseCase.execute(invalidEmail)).rejects.toThrow(
      new EntityError("email")
    );
  });

  it("should throw NoItemsFound when user is not found", async () => {
    const email = "nonexistent@example.com";
    vi.spyOn(userRepoMock, "getUserByEmail").mockResolvedValue(undefined);

    await expect(resendCodeUseCase.execute(email)).rejects.toThrow(
      new NoItemsFound("email")
    );
    expect(userRepoMock.getUserByEmail).toHaveBeenCalledWith(email);
  });

  it("should resend the code and send an email when user is found", async () => {
    const email = userRepoMock.user_mock.users[0].userEmail;
    const user = userRepoMock.user_mock.users[0];
    const code = "123456";

    vi.spyOn(userRepoMock, "getUserByEmail").mockResolvedValue(user);
    vi.spyOn(userRepoMock, "resendCode").mockResolvedValue(code);
    vi.spyOn(mailRepositoryMock, "sendMail").mockResolvedValue(undefined);

    const result = await resendCodeUseCase.execute(email);

    expect(result).toBe(code);
    expect(userRepoMock.getUserByEmail).toHaveBeenCalledWith(email);
    expect(userRepoMock.resendCode).toHaveBeenCalledWith(email);
    expect(mailRepositoryMock.sendMail).toHaveBeenCalledWith(
      email,
      "Verificação de conta",
      `Seu novo código de verificação é: ${code}`
    );
  });
});
