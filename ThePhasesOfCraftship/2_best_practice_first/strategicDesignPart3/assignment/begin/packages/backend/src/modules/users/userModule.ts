import { Database } from "../../shared/database";
import { WebServer } from "../../shared/http/webServer";
import { UserController } from "./userController";
import { userErrorHandler } from "./userErrors";
import { UserService } from "./userService";

export class UserModule {
    private userService: UserService;
    private userController: UserController;

    constructor(private dbConnection: Database,) {
        this.userService = this.createUserService();
        this.userController = this.createUserController();
    }

    static build(dbConnection: Database) {
        return new UserModule(dbConnection);
    }

    public getUserController() {
        return this.userController;
    }

    mountRouter(webServer: WebServer) {
        webServer.mountRouter("/users", this.userController.getRouter());
    }

    createUserService() {
        return new UserService(this.dbConnection);
    }

    createUserController(): UserController {
        return new UserController(this.userService, userErrorHandler);
    }
}
