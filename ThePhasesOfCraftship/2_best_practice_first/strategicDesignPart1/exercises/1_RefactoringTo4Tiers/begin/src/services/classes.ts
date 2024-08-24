import { CreateClassDTO } from "../dtos/CreateClassDTO";
import { EnrollStudentDTO } from "../dtos/EnrollStudentDTO";
import { Database } from "../persistence/database";
import {
  ClassNotFoundException,
  StudentAlreadyEnrolledException,
  StudentNotFoundException,
} from "../shared/exceptions";

class ClassService {
  constructor(private db: Database) {}

  async saveClass(dto: CreateClassDTO) {
    const name = dto.name;
    const result = await this.db.classes.save(name);
    return result;
  }

  async getAllClasses() {
    const result = await this.db.classes.getAll();
    return result;
  }

  async getById(id: string) {
    const result = await this.db.classes.getById(id);
    return result;
  }

  async enrollStudent(dto: EnrollStudentDTO) {
    const { studentId, classId } = dto;

    // check if student exists
    const student = await this.db.students.getById(studentId);

    if (!student) {
      throw new StudentNotFoundException();
    }

    // check if class exists
    const cls = await this.db.classes.getById(classId);
    if (!cls) {
      throw new ClassNotFoundException(classId);
    }

    // check if student is already enrolled in class
    const isStudentEnrolled = await this.db.classes.getEnrollment(classId, studentId);
    if (!!isStudentEnrolled) {
      throw new StudentAlreadyEnrolledException();
    }

    const result = await this.db.classes.saveEnrollment(classId, studentId);
    return result;
  }
}

export default ClassService;
