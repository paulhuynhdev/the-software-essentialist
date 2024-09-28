import { TransactionalEmailAPI } from "./transactionalEmailAPI";

export class NotificationModule {
    transactionalEmailAPI: TransactionalEmailAPI;

    private constructor() {
        this.transactionalEmailAPI = this.createTransactionalEmailAPI();
    }

    static build()  {
        return new NotificationModule();
    }

    private createTransactionalEmailAPI() {
        return new TransactionalEmailAPI();
    }

    public getTransactionalEmailAPI() {
        return this.transactionalEmailAPI;
    }
}
