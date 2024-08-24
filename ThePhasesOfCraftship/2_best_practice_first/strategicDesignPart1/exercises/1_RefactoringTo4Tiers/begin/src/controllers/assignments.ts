import express, { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../shared/errorHandler";
import { parseForResponse } from "../helpers/parseForResponse";
import AssignmentService from "../services/assignments";
import { CreateAssignmentDTO } from "../dtos/CreateAssignmentDTO";
import { isUUID } from "../helpers/isUUID";
import { ErrorExceptionType } from "../shared/constants";
import { AssignStudentDTO } from "../dtos/AssignStudentDTO";
import { SubmitAssignmentDTO } from "../dtos/SubmitAssignmentDTO";
import { GradeAssignmentDTO } from "../dtos/GradeAssignmentDTO";

export class AssignmentController {
  private router = express.Router();

  constructor(private assignmentService: AssignmentService, private errorHandler: ErrorHandler) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private setupRoutes() {
    this.router.post("/", this.createAssignment);
    this.router.get("/:id", this.getAssignmentById);
    this.router.post("/student-assignments", this.assignStudentAssignment);
    this.router.post("/submit", this.submit);
    this.router.post("/grade", this.grade);
  }

  public getRouter() {
    return this.router;
  }

  private grade = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = GradeAssignmentDTO.fromRequest(req.body);

      const data = await this.assignmentService.gradeAssignment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = SubmitAssignmentDTO.fromRequest(req.body);

      const data = await this.assignmentService.submitAssignment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private assignStudentAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = AssignStudentDTO.fromRequest(req.body);

      const data = await this.assignmentService.setStudentAssignment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private getAssignmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res
          .status(400)
          .json({ error: ErrorExceptionType.ValidationError, data: undefined, success: false });
      }
      const assignment = await this.assignmentService.getById(id);
      if (!assignment) {
        return res
          .status(404)
          .json({ error: ErrorExceptionType.AssignmentNotFound, data: undefined, success: false });
      }

      res.status(200).json({ error: undefined, data: parseForResponse(assignment), success: true });
    } catch (error) {
      next(error);
    }
  };

  private createAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = CreateAssignmentDTO.fromRequest(req.body);
      const data = await this.assignmentService.saveAssignment(dto);
      res.status(201).json({ error: undefined, data: parseForResponse(data), success: true });
    } catch (error) {
      next(error);
    }
  };
}
