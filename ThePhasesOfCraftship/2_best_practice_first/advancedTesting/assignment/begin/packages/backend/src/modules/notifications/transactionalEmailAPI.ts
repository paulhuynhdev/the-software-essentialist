export class TransactionalEmailAPI {
  async sendMail(input: {
    to: string;
    subject: string;
    text: string;
  }): Promise<boolean> {
    console.log(
      `Sending email to ${input.to} with subject ${input.subject} and text ${input.text}`,
    );
    return true;
  }
}
