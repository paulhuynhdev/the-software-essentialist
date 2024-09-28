import express from "express";
import cors from "cors";
import { Server } from "http";
import { ProcessService } from "@dddforum/backend/src/shared/processes/processService";
import { UserController } from "@dddforum/backend/src/modules/users";

interface WebServerConfig {
  port: number;
  env: string;
}

interface Controllers {
  usersController: UserController;
}

export class WebServer {
  private express: express.Express;
  private state: "stopped" | "started";
  private instance: Server | undefined;

  constructor(private config: WebServerConfig) {
    this.state = "stopped";
    this.express = express();
    this.initializeServer();
  }

  private initializeServer() {
    this.addMiddlewares();
    this.express.use(cors());
  }

  private addMiddlewares() {
    this.express.use(express.json());
  }

  public getApplication() {
    return this.express;
  }

  mountRouter(path: string, router: express.Router) {
    this.express.use(path, router);
  }

  async start(): Promise<void> {
    return new Promise((resolve, _reject) => {
      ProcessService.killProcessOnPort(this.config.port, () => {
        if (this.config.env === " test") {
          resolve();
        }
        console.log("Starting the server");
        this.instance = this.express.listen(this.config.port, () => {
          console.log(`Server is running on port ${this.config.port}`);
          this.state = "started";
          resolve();
        });
      });
    });
  }

  async stop() {
    return new Promise((resolve, reject) => {
      if (!this.instance) return reject("Server not started");
      this.instance.close((err) => {
        if (err) return reject("Error stopping the server");
        this.state = "stopped";
        return resolve("Server stopped");
      });
    });
  }

  isStarted() {
    return this.state === "started";
  }
}
