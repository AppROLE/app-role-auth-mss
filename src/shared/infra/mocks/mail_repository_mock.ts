import { IMailRepository } from "../../domain/irepositories/mail_repository_interface";

export class MailRepositoryMock implements IMailRepository {
  public sentEmails: { to: string; subject: string; body: string }[] = [];

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    this.sentEmails.push({ to, subject, body });
  }

  wasEmailSent(to: string, subject: string, body: string): boolean {
    return this.sentEmails.some(
      (email) =>
        email.to === to && email.subject === subject && email.body === body
    );
  }

  clearSentEmails(): void {
    this.sentEmails = [];
  }
}
