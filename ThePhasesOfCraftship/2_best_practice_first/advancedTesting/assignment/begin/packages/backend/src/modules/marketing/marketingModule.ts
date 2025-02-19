import { Config } from "../../shared/config";
import { WebServer } from "../../shared/http/webServer";
import { ContactListAPISpy } from "./adapters/ContactListAPISpy";
import { MailChimpContactList } from "./adapters/MailChimpContactList";
import { MarketingController } from "./marketingController";
import { marketingErrorHandler } from "./marketingErrors";
import { MarketingService } from "./marketingService";
import { ContactListAPI } from "./ports/ContactListAPI";

export class MarketingModule {
  private marketingService: MarketingService;
  private marketingController: MarketingController;
  private contactListAPI: ContactListAPI;

  private constructor(config: Config) {
    this.contactListAPI = this.buildContactListAPI(config);
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
  }

  getMarketingService() {
    return this.marketingService;
  }

  static build(config: Config) {
    return new MarketingModule(config);
  }

  private createMarketingService() {
    return new MarketingService(this.contactListAPI);
  }

  private createMarketingController() {
    return new MarketingController(
      this.marketingService,
      marketingErrorHandler,
    );
  }

  private buildContactListAPI(config: Config) {
    if (config.getScript() === "test:unit") {
      return ContactListAPISpy.getInstance();
    }
    return new MailChimpContactList();
  }

  public getMarketingController() {
    return this.marketingController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/marketing", this.marketingController.getRouter());
  }
}
