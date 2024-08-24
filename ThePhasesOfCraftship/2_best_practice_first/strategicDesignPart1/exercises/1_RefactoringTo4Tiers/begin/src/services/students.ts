import { CreateStudentDTO } from "../dtos/CreateStudentDTO";
import { Database } from "../persistence/database";
import { StudentNotFoundException } from "../shared/exceptions";

class StudentService {
  constructor(private db: Database) {}

  async createStudent(dto: CreateStudentDTO) {
    const name = dto.name;
    const student = await this.db.students.save(name);
    return student;
  }

  async getAllStudents() {
    const response = await this.db.students.getAll();

    return response;
  }

  async getStudentById(id: string) {
    const student = await this.db.students.getById(id);
    return student;
  }

  async getStudentGrades(id: string) {
    // check if student exists
    const student = await this.db.students.getById(id);
    if (!student) {
      throw new StudentNotFoundException();
    }
    const studentGrades = await this.db.students.getGrades(id);

    return studentGrades;
  }

  async getAssignments(id: string) {
    // check if student exists
    const student = await this.db.students.getById(id);
    if (!student) {
      throw new StudentNotFoundException();
    }
    const studentAssignments = await this.db.students.getAssignments(id);

    return studentAssignments;
  }
}

export default StudentService;
