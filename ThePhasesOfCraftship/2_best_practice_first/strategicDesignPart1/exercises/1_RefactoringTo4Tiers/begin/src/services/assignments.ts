import { AssignStudentDTO } from "../dtos/AssignStudentDTO";
import { CreateAssignmentDTO } from "../dtos/CreateAssignmentDTO";
import { GradeAssignmentDTO } from "../dtos/GradeAssignmentDTO";
import { SubmitAssignmentDTO } from "../dtos/SubmitAssignmentDTO";
import { Database } from "../persistence/database";
import {
  AssignmentNotFoundException,
  ClassNotFoundException,
  InvalidParameterException,
  StudentAssignmentNotFoundException,
  StudentNotFoundException,
} from "../shared/exceptions";

class AssignmentService {
  constructor(private db: Database) {}

  async saveAssignment(dto: CreateAssignmentDTO) {
    const { classId, title } = dto;

    const cls = await this.db.classes.getById(classId);
    if (!cls) {
      throw new ClassNotFoundException(classId);
    }

    const result = await this.db.assignments.save(classId, title);
    return result;
  }

  async getById(id: string) {
    const result = await this.db.assignments.getById(id);
    return result;
  }

  async setStudentAssignment(dto: AssignStudentDTO) {
    const { studentId, assignmentId } = dto;
    // check if student exists
    const student = await this.db.students.getById(studentId);
    if (!student) {
      throw new StudentNotFoundException();
    }

    // check if assignment exists
    const assignment = await this.db.assignments.getById(assignmentId);
    if (!assignment) {
      throw new AssignmentNotFoundException();
    }

    const result = await this.db.assignments.addStudent(assignmentId, studentId);
    return result;
  }

  async gradeAssignment(dto: GradeAssignmentDTO) {
    const { studentId, assignmentId, grade } = dto;
    if (!["A", "B", "C", "D"].includes(grade)) {
      throw new InvalidParameterException("Invalid Grade. Grade must be A, B, C, or D");
    }

    const studentAssignment = await this.db.assignments.getStudentAssignment(
      assignmentId,
      studentId
    );
    if (!studentAssignment) {
      throw new StudentAssignmentNotFoundException();
    }

    const result = await this.db.assignments.grade(studentAssignment.id, grade);

    return result;
  }

  async submitAssignment(dto: SubmitAssignmentDTO) {
    const { studentId, assignmentId } = dto;
    // check if student assignment exists
    const studentAssignment = await this.db.assignments.getStudentAssignment(
      assignmentId,
      studentId
    );

    if (!studentAssignment) {
      throw new StudentAssignmentNotFoundException();
    }
    const result = await this.db.assignments.submit(studentAssignment.id);

    return result;
  }
}

export default AssignmentService;
