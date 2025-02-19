export interface IContactListAPI {
  addEmailToList(email: string): Promise<boolean>;
}
