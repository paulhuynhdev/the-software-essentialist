import { UsersController } from "./usersController";
import { TransactionalEmailAPI } from "../notifications/transactionalEmailAPI";
import { WebServer } from "../../shared/http/webServer";
import { UsersService } from "./usersService";
import { userErrorHandler } from "./usersErrors";
import { UsersRepository } from "./ports/usersRepository";
import { Config } from "../../shared/config";
import { InMemoryUserRepository } from "./adapters/inMemoryUsersRepository";
import { ProductionUsersRepository } from "./adapters/productionUsersRepository";
import { Database } from "../../shared/database";

export class UsersModule {
  private usersService: UsersService;
  private usersController: UsersController;
  private usersRepository: UsersRepository;

  private constructor(
    private dbConnection: Database,
    private emailAPI: TransactionalEmailAPI,
    private config: Config,
  ) {
    this.usersRepository = this.createUserRepository();
    this.usersService = this.createUsersService();
    this.usersController = this.createUsersController();
    this.config = config;
  }

  shouldBuildFakeRepository() {
    return (
      this.config.getScript() === "test:unit" ||
      this.config.getEnvironment() === "development"
    );
  }

  private createUserRepository() {
    if (this.usersRepository) return this.usersRepository;

    if (this.shouldBuildFakeRepository()) {
      return new InMemoryUserRepository();
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

  private createUsersController() {
    return new UsersController(this.usersService, userErrorHandler);
  }

  public getController() {
    return this.usersController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/users", this.usersController.getRouter());
  }
}
