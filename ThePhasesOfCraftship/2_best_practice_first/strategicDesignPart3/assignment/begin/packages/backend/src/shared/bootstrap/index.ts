import { PrismaClient } from "@prisma/client";
import { UserController } from "../../modules/users";
import { UserService } from "../../modules/users";
import { Application } from "./application";
import { ErrorExceptionHandler } from "../errors";
import { Database } from "../database";

const prisma = new PrismaClient();
const db = new Database(prisma);

const errorHandler = new ErrorExceptionHandler();
const userService = new UserService(db);

const userController = new UserController(userService, errorHandler);

const application = new Application(userController);

export default application;
