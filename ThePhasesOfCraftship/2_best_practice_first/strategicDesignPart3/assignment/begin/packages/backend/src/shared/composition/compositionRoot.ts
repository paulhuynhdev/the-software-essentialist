import { Config } from "../config";
import { Database } from "../database";
import { WebServer } from "../http/webServer";
import { MarketingModule } from "../../modules/marketings";
import { UserModule } from "../../modules/users";
import { NotificationModule } from "../../modules/notifications";

export class CompositionRoot {
  private webServer: WebServer;
  private dbConnection: Database;
  private config: Config;
  private notificationModule: NotificationModule
  private marketingModule: MarketingModule;
  private userModule: UserModule;
  private static instance: CompositionRoot | null = null;

  public static createCompositionRoot(config: Config) {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new this(config);
    }
    return CompositionRoot.instance;
  }

  private constructor(config: Config) {
    this.config = config;
    this.dbConnection = this.createDBConnection();
    this.notificationModule = this.createNotificationModule();
    this.marketingModule = this.createMarketingModule();
    this.userModule = this.createUserModule();
    this.webServer = this.createWebServer();
    this.mountRoutes();
  }

  mountRoutes() {
    this.marketingModule.mountRouter(this.webServer)
    this.userModule.mountRouter(this.webServer)
  }

  createNotificationModule(): NotificationModule {
    return NotificationModule.build();
  }

  createMarketingModule(): MarketingModule {
    return MarketingModule.build();
  }

  createUserModule(): any {
    return UserModule.build(this.dbConnection, this.notificationModule.getTransactionalEmailAPI());
  }

  private createDBConnection() {
    const dbConnection = new Database();
    if (!this.dbConnection) {
      this.dbConnection = dbConnection;
    }
    return dbConnection;
  }

  getDBConnection() {
    if (!this.dbConnection) this.createDBConnection();
    return this.dbConnection;
  }

  createWebServer() {
    return new WebServer({ port: 3000, env: this.config.env });
  }

  getWebServer() {
    return this.webServer;
  }
}
