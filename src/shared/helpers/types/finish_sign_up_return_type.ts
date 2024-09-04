export type FinishSignUpReturnType = {
  email: string;
  newUsername: string;
  newNickname: string;
  acceptedTerms: string | undefined;
  roleType: string | undefined;
  name: string;
}