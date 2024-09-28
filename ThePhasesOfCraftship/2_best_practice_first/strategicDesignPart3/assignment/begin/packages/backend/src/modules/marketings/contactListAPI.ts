export class ContactListAPI {
    addEmailToList(email: string): Promise<boolean> {
        console.log("addEmailToList", email);
        return Promise.resolve(true);
    }
}
