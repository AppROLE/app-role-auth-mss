import { describe, it, expect, vi, beforeEach } from "vitest";
import { SignInUseCase } from "../../src/modules/sign_in/app/sign_in_usecase";
import { UserRepoMock } from "../../src/shared/infra/repositories/auth/auth_repository_mock";
import { InvalidCredentialsError } from "../../src/shared/helpers/errors/login_errors";

describe("SignInUseCase", () => {
  let userRepoMock: UserRepoMock;
  let signInUseCase: SignInUseCase;

  beforeEach(() => {
    userRepoMock = new UserRepoMock();
    signInUseCase = new SignInUseCase(userRepoMock);

    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should throw InvalidCredentialsError when session is not created", async () => {
    const email = "test@example.com";
    const password = "wrongpassword";
    vi.spyOn(userRepoMock, "signIn").mockResolvedValue(null);

    await expect(signInUseCase.execute(email, password)).rejects.toThrow(
      new InvalidCredentialsError()
    );
    expect(userRepoMock.signIn).toHaveBeenCalledWith(email, password);
  });

  it("should return session when valid credentials are provided", async () => {
    const email = "test@example.com";
    const password = "password123";
    const session = { token: "token" };
    vi.spyOn(userRepoMock, "signIn").mockResolvedValue(session);

    const result = await signInUseCase.execute(email, password);

    expect(result).toEqual(session);
    expect(userRepoMock.signIn).toHaveBeenCalledWith(email, password);
  });
});
