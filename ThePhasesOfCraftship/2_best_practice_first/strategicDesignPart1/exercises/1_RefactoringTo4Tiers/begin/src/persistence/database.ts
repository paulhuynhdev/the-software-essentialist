import { PrismaClient } from "@prisma/client";

interface StudentPersistence {
  save(name: string): any;
  getAll(): any;
  getById(id: string): any;
  getGrades(id: string): any;
  getAssignments(id: string): any;
}

interface ClassPersistence {
  save(name: string): any;
  getAll(): any;
  getById(id: string): any;
  getEnrollment(classId: string, studentId: string): any;
  saveEnrollment(classId: string, studentId: string): any;
  getAssignments(classId: string): any;
}

interface AssignmentPersistence {
  save(classId: string, title: string): any;
  getById(id: string): any;
  addStudent(assignmentId: string, studentId: string): any;
  getStudentAssignment(assignmentId: string, studentId: string): any;
  submit(id: string): any;
  grade(id: string, grade: string): any;
}

export class Database {
  public students: StudentPersistence;
  public classes: ClassPersistence;
  public assignments: AssignmentPersistence;

  constructor(private prisma: PrismaClient) {
    this.students = this.buildStudentPersistence();
    this.classes = this.buildClassPersistence();
    this.assignments = this.buildAssignmentPersistence();
  }

  buildAssignmentPersistence(): AssignmentPersistence {
    return {
      save: this.saveAssignment,
      getById: this.getAssignmentById,
      addStudent: this.setStudentAssignment,
      getStudentAssignment: this.getStudentAssignment,
      submit: this.submitAssignment,
      grade: this.gradeAssignment,
    };
  }

  private buildStudentPersistence(): StudentPersistence {
    return {
      save: this.saveStudent,
      getAll: this.getAllStudents,
      getById: this.getStudentById,
      getGrades: this.getStudentGrades,
      getAssignments: this.getStudentAssignments,
    };
  }

  private buildClassPersistence(): ClassPersistence {
    return {
      save: this.saveClass,
      getAll: this.getAllClasses,
      getById: this.getClassById,
      getEnrollment: this.getEnrollment,
      saveEnrollment: this.saveEnrollment,
      getAssignments: this.getClassAssignments,
    };
  }

  // assignment
  private getStudentAssignment = async (assignmentId: string, studentId: string) => {
    const data = await this.prisma.studentAssignment.findFirst({
      where: {
        assignmentId,
        studentId,
      },
    });

    return data;
  };

  private submitAssignment = async (id: string) => {
    const data = await this.prisma.studentAssignment.update({
      where: {
        id,
      },
      data: {
        status: "submitted",
      },
    });

    return data;
  };

  private gradeAssignment = async (id: string, grade: string) => {
    const data = await this.prisma.studentAssignment.update({
      where: {
        id,
      },
      data: {
        grade,
      },
    });

    return data;
  };

  private setStudentAssignment = async (assignmentId: string, studentId: string) => {
    const studentAssignment = await this.prisma.studentAssignment.create({
      data: {
        studentId,
        assignmentId,
      },
    });

    return studentAssignment;
  };

  private saveAssignment = async (classId: string, title: string) => {
    const result = await this.prisma.assignment.create({
      data: {
        classId,
        title,
      },
    });

    return result;
  };

  private getAssignmentById = async (id: string) => {
    const data = await this.prisma.assignment.findUnique({
      include: {
        class: true,
        studentTasks: true,
      },
      where: {
        id,
      },
    });

    return data;
  };

  // class
  private saveClass = async (name: string) => {
    const result = await this.prisma.class.create({
      data: {
        name,
      },
    });

    return result;
  };

  private getAllClasses = async () => {
    const classes = await this.prisma.class.findMany({
      include: {
        students: true,
        assignments: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return classes;
  };

  private getClassById = async (id: string) => {
    const data = await this.prisma.class.findUnique({
      where: {
        id,
      },
    });

    return data;
  };

  private saveEnrollment = async (classId: string, studentId: string) => {
    const result = await this.prisma.classEnrollment.create({
      data: {
        classId,
        studentId,
      },
    });

    return result;
  };

  private getEnrollment = async (classId: string, studentId: string) => {
    const result = await this.prisma.classEnrollment.findFirst({
      where: {
        classId,
        studentId,
      },
    });

    return result;
  };

  private getClassAssignments = async (classId: string) => {
    const data = await this.prisma.assignment.findMany({
      where: {
        classId: classId,
      },
      include: {
        class: true,
        studentTasks: true,
      },
    });

    return data;
  };

  // student
  private getStudentAssignments = async (id: string) => {
    const data = await this.prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        status: "submitted",
      },
      include: {
        assignment: true,
      },
    });

    return data;
  };

  private saveStudent = async (name: string) => {
    const data = await this.prisma.student.create({
      data: {
        name,
      },
    });
    return data;
  };

  private getAllStudents = async () => {
    const students = await this.prisma.student.findMany({
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return students;
  };

  private getStudentById = async (id: string) => {
    const student = await this.prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
    });
    return student;
  };

  private getStudentGrades = async (id: string) => {
    const data = await this.prisma.studentAssignment.findMany({
      where: {
        studentId: id,
      },
      include: {
        assignment: true,
      },
    });

    return data;
  };
}
