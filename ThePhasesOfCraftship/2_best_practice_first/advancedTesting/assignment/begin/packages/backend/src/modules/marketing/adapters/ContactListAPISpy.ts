import { Spy } from "@dddforum/shared/testDoubles/spy";
import { IContactListAPI } from "../interfaces";

export class ContactListAPISpy
  extends Spy<IContactListAPI>
  implements IContactListAPI
{
  private static instance: ContactListAPISpy | null = null;

  constructor() {
    super();
  }

  public static getInstance() {
    if (ContactListAPISpy.instance) {
      return ContactListAPISpy.instance;
    }
    ContactListAPISpy.instance = new ContactListAPISpy();
    return ContactListAPISpy.instance;
  }

  private emails: string[] = [];

  async addEmailToList(email: string): Promise<boolean> {
    this.addCall("addEmailToList", [email]);
    this.emails.push(email);
    return Promise.resolve(true);
  }

  getEmails() {
    return this.emails;
  }

  async reset() {
    this.calls = [];
    this.emails = [];
  }
}
