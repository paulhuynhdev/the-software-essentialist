import { Database } from "../../shared/database";
import { WebServer } from "../../shared/http/webServer";
import { TransactionalEmailAPI } from "../notifications/transactionalEmailAPI";
import { UserController } from "./userController";
import { userErrorHandler } from "./userErrors";
import { UserService } from "./userService";

export class UserModule {
    private userService: UserService;
    private userController: UserController;

    constructor(private dbConnection: Database, private emailAPI: TransactionalEmailAPI) {
        this.userService = this.createUserService();
        this.userController = this.createUserController();
    }
    createEmailAPI(): TransactionalEmailAPI {
        throw new Error("Method not implemented.");
    }

    static build(dbConnection: Database, emailAPI: TransactionalEmailAPI) {
        return new UserModule(dbConnection, emailAPI);
    }

    public getUserController() {
        return this.userController;
    }

    mountRouter(webServer: WebServer) {
        webServer.mountRouter("/users", this.userController.getRouter());
    }

    createUserService() {
        return new UserService(this.dbConnection, this.emailAPI);
    }

    createUserController(): UserController {
        return new UserController(this.userService, userErrorHandler);
    }
}
