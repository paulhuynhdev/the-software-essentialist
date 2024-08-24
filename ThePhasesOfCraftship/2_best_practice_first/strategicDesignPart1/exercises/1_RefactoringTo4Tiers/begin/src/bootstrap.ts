import { PrismaClient } from "@prisma/client";
import { Database } from "./persistence/database";
import { StudentService } from "./services";
import { StudentsController } from "./controllers/students";
import { errorHandler } from "./shared/errorHandler";
import { Application } from "./application";
import ClassService from "./services/classes";
import { ClassesController } from "./controllers/classes";
import AssignmentService from "./services/assignments";
import { AssignmentController } from "./controllers/assignments";
import { ErrorExceptionHandler } from "./shared/errors";

const prisma = new PrismaClient();
const db = new Database(prisma);

// const errorHandler = new ErrorExceptionHandler();

const studentService = new StudentService(db);
const classService = new ClassService(db);
const assignmentService = new AssignmentService(db);

const studentController = new StudentsController(studentService, errorHandler);
const classController = new ClassesController(classService, errorHandler);
const assignmentController = new AssignmentController(assignmentService, errorHandler);

const application = new Application(studentController, classController, assignmentController);

export default application;
