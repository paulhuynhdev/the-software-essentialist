import { UsersController } from "./usersController";
import { TransactionalEmailAPI } from "../notifications/transactionalEmailAPI";
import { WebServer } from "../../shared/http/webServer";
import { UsersService } from "./usersService";
import { UsersRepository } from "./ports/usersRepository";
import { Config } from "../../shared/config";
import { ProductionUsersRepository } from "./adapters/productionUsersRepository";
import { Database } from "../../shared/database";
import { Application } from "../../shared/http/interfaces";
import { InMemoryUsersRepositorySpy } from "./adapters/InMemoryUsersRepositorySpy";

export class UsersModule {
  private usersService: UsersService;
  // private usersController: UsersController;
  private usersRepository: UsersRepository;

  private constructor(
    private dbConnection: Database,
    private emailAPI: TransactionalEmailAPI,
    private config: Config,
  ) {
    this.usersRepository = this.createUserRepository();
    this.usersService = this.createUsersService();
    // this.usersController = this.createUsersController();
    this.config = config;
  }

  shouldBuildFakeRepository() {
    return (
      this.config.getScript() === "test:unit" ||
      this.config.getEnvironment() === "development"
    );
  }

  getUsersService() {
    return this.usersService;
  }

  private createUserRepository() {
    if (this.usersRepository) return this.usersRepository;

    if (this.shouldBuildFakeRepository()) {
      return InMemoryUsersRepositorySpy.getInstance();
    }

    return new ProductionUsersRepository(this.dbConnection.getConnection());
  }

  static build(
    dbConnection: Database,
    emailAPI: TransactionalEmailAPI,
    config: Config,
  ) {
    return new UsersModule(dbConnection, emailAPI, config);
  }

  private createUsersService() {
    return new UsersService(this.usersRepository, this.emailAPI);
  }

  private createUsersController(application: Application) {
    return new UsersController(application);
  }

  // public getController() {
  //   return this.usersController;
  // }

  public mountRouter(webServer: WebServer) {
    const application = webServer.getApplication();
    const usersController = this.createUsersController(application);
    webServer.mountRouter("/users", usersController.getRouter());
  }
}
