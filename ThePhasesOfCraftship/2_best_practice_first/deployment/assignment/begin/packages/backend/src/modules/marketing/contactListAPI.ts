export class ContactListAPI {
  async addEmailToList(email: string): Promise<boolean> {
    // Do the actual work
    // eslint-disable-next-line no-console
    console.info(
      `MailchimpContactList: Adding ${email} list... for production usage.`,
    );
    return true;
  }
}
