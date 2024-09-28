import { WebServer } from "../../shared/http/webServer";
import { ContactListAPI } from "./ContactListAPI";
import { MarketingController } from "./marketingController";
import { marketingErrorHandler } from "./marketingErrors";
import { MarketingService } from "./marketingService";

export class MarketingModule {
    private marketingService: MarketingService;
    private marketingController: MarketingController;
    private contactListAPI: ContactListAPI;

    constructor() {
        this.contactListAPI = this.buildContactListAPI();
        this.marketingService = this.createMarketingService();
        this.marketingController = this.createMarketingController();
    }

    static build() {
        return new MarketingModule();
    }

    public getMarketingController() {
        return this.marketingController;
    }

    mountRouter(webServer: WebServer) {
        webServer.mountRouter("/marketings", this.marketingController.getRouter());
    }

    buildContactListAPI() {
        return new ContactListAPI();
    }

    createMarketingService() {
        return new MarketingService(this.contactListAPI);
    }

    createMarketingController() {
        return new MarketingController(this.marketingService, marketingErrorHandler);
    }
}
