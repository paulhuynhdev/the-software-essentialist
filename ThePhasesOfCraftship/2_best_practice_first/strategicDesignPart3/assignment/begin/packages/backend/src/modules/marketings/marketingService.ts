import { ServerErrorException } from "../../shared/exceptions";
import { ContactListAPI } from "./ContactListAPI";

export class MarketingService {
    constructor(private contactListAPI: ContactListAPI) { }

    async addEmailToList(email: string): Promise<boolean> {
        try {
            const result = await this.contactListAPI.addEmailToList(email);
            return result;
        } catch (error) {
            throw new ServerErrorException();
        }
    }
}
