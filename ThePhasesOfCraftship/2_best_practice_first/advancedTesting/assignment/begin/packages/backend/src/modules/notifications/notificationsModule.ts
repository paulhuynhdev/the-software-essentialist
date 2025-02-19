import { TransactionalEmailAPI } from "./transactionalEmailAPI";
import { Config } from "@dddforum/backend/src/shared/config";
import { TransactionalEmailAPISpy } from "./transactionalEmailAPISpy";

export class NotificationsModule {
  private transactionalEmailAPI: TransactionalEmailAPI;

  private constructor() {
    this.transactionalEmailAPI = this.createTransactionalEmailAPI();
  }

  static build() {
    return new NotificationsModule();
  }

  public getTransactionalEmailAPI(config: Config) {
    if (config.getScript() === "test:unit") {
      return TransactionalEmailAPISpy.getInstance();
    }
    return this.transactionalEmailAPI;
  }

  private createTransactionalEmailAPI() {
    return new TransactionalEmailAPI();
  }
}
