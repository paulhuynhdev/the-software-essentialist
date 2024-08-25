import { Request, Response } from "express";
import { prisma } from "../database";
import { isMissingKeys, isUUID, parseForResponse } from "../utils/common";
import { Errors } from "../utils/constants";

const createAssignmentController = async (req: Request, res: Response) => {
  try {
    if (isMissingKeys(req.body, ["classId", "title"])) {
      return res.status(400).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    const { classId, title } = req.body;

    const assignment = await prisma.assignment.create({
      data: {
        classId,
        title,
      },
    });

    res.status(201).json({
      error: undefined,
      data: parseForResponse(assignment),
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: Errors.ServerError, data: undefined, success: false });
  }
};

const assignStudentController = async (req: Request, res: Response) => {
  try {
    if (isMissingKeys(req.body, ["studentId", "assignmentId"])) {
      return res.status(400).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    const { studentId, assignmentId, grade } = req.body;

    // check if student exists
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return res.status(404).json({
        error: Errors.StudentNotFound,
        data: undefined,
        success: false,
      });
    }

    // check if assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
    });

    if (!assignment) {
      return res.status(404).json({
        error: Errors.AssignmentNotFound,
        data: undefined,
        success: false,
      });
    }

    const studentAssignment = await prisma.studentAssignment.create({
      data: {
        studentId,
        assignmentId,
      },
    });

    res.status(201).json({
      error: undefined,
      data: parseForResponse(studentAssignment),
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: Errors.ServerError, data: undefined, success: false });
  }
};

const submitAssignmentController = async (req: Request, res: Response) => {
  try {
    if (isMissingKeys(req.body, ["assignmentId", "studentId"])) {
      return res.status(400).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    const { studentId, assignmentId } = req.body;

    // check if student assignment exists
    const studentAssignment = await prisma.studentAssignment.findUnique({
      where: {
        studentId_assignmentId: {
          assignmentId,
          studentId,
        },
      },
    });

    if (!studentAssignment) {
      return res.status(404).json({
        error: Errors.AssignmentNotFound,
        data: undefined,
        success: false,
      });
    }

    const studentAssignmentUpdated = await prisma.studentAssignment.update({
      where: {
        studentId_assignmentId: {
          assignmentId,
          studentId,
        },
      },
      data: {
        status: "submitted",
      },
    });

    res.status(200).json({
      error: undefined,
      data: parseForResponse(studentAssignmentUpdated),
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: Errors.ServerError, data: undefined, success: false });
  }
};

const gradeAssignmentController = async (req: Request, res: Response) => {
  try {
    if (isMissingKeys(req.body, ["studentId", "assignmentId", "grade"])) {
      return res.status(400).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    const { assignmentId, studentId, grade } = req.body;

    // validate grade
    if (!["A", "B", "C", "D"].includes(grade)) {
      return res.status(400).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    // check if student assignment exists
    const studentAssignment = await prisma.studentAssignment.findUnique({
      where: {
        studentId_assignmentId: {
          assignmentId,
          studentId,
        },
      },
    });

    if (!studentAssignment) {
      return res.status(404).json({
        error: Errors.AssignmentNotFound,
        data: undefined,
        success: false,
      });
    }

    const studentAssignmentUpdated = await prisma.studentAssignment.update({
      where: {
        studentId_assignmentId: {
          assignmentId,
          studentId,
        },
      },
      data: {
        grade,
      },
    });

    res.status(200).json({
      error: undefined,
      data: parseForResponse(studentAssignmentUpdated),
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: Errors.ServerError, data: undefined, success: false });
  }
};

const getAssignmentByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isUUID(id)) {
      return res.status(400).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }
    const assignment = await prisma.assignment.findUnique({
      include: {
        class: true,
        studentTasks: true,
      },
      where: {
        id,
      },
    });

    if (!assignment) {
      return res.status(404).json({
        error: Errors.AssignmentNotFound,
        data: undefined,
        success: false,
      });
    }

    res.status(200).json({
      error: undefined,
      data: parseForResponse(assignment),
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: Errors.ServerError, data: undefined, success: false });
  }
};

export {
  createAssignmentController,
  assignStudentController,
  submitAssignmentController,
  gradeAssignmentController,
  getAssignmentByIdController,
};
