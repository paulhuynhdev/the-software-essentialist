import { PrismaClient } from "@prisma/client";
import { generateRandomPassword } from "../utils/generateRandomPassword";

type NewUser = {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
};

export interface UsersPersistence {
  save(user: NewUser): any;
  findUserByEmail(email: string): any;
  findUserByUsername(username: string): any;
}

export interface MemberPersistence {
  save(userId: string): any;
}

export class Database {
  users: UsersPersistence;

  constructor(private prisma: PrismaClient) {
    this.users = this.buildUserPersistence();
  }

  buildUserPersistence(): UsersPersistence {
    return {
      save: this.saveUser,
      findUserByEmail: this.findUserByEmail,
      findUserByUsername: this.findUserByUsername,
    };
  }
  private findUserByUsername = async (username: string) => {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });
    return user;
  };

  private findUserByEmail = async (email: string) => {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    return user;
  };

  private saveUser = async (newUser: NewUser) => {
    const { email, firstName, lastName, username } = newUser;
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        firstName,
        lastName,
        password: generateRandomPassword(10),
      },
    });

    const member = await this.prisma.member.create({
      data: { userId: user.id },
    });

    return { user, member };
  };
}
