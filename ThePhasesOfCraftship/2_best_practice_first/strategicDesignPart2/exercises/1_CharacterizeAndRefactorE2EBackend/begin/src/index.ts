import express, {  } from "express";
import cors from "cors";
import { createClassController, enrollClassController, getAllClassAssignmentController } from "./controllers/classController";
import { assignStudentController, createAssignmentController, getAssignmentByIdController, gradeAssignmentController, submitAssignmentController } from "./controllers/assignmentController";
import { createStudentController, getAllStudentController, getAllStudentGradeController, getAllSubmittedAssignmentController, getStudentByIdController } from "./controllers/studentController";

const app = express();
app.use(express.json());
app.use(cors());

// API Endpoints
// POST student created
app.post("/students", createStudentController);

// POST class created
app.post("/classes", createClassController);

// POST student assigned to class
app.post("/class-enrollments", enrollClassController);

// POST assignment created
app.post("/assignments", createAssignmentController);

// POST student assigned to assignment
app.post("/student-assignments", assignStudentController);

// POST student submitted assignment
app.post("/student-assignments/submit", submitAssignmentController);

// POST student assignment graded
app.post("/student-assignments/grade", gradeAssignmentController);

// GET all students
app.get("/students", getAllStudentController);

// GET a student by id
app.get("/students/:id", getStudentByIdController);

// GET assignment by id
app.get("/assignments/:id", getAssignmentByIdController);

// GET all assignments for class
app.get("/classes/:id/assignments", getAllClassAssignmentController);

// GET all student submitted assignments
app.get("/student/:id/assignments", getAllSubmittedAssignmentController);

// GET all student grades
app.get("/student/:id/grades", getAllStudentGradeController);

const port = process.env.PORT || 3000;

let http = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { http };
