import { User, ValidatedUser } from "@dddforum/shared/src/api/users";
import { UsersRepository } from "../ports/usersRepository";
import { PrismaClient } from "@prisma/client";

export class ProductionUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    try {
      const maybeUser = await this.prisma.user.findFirst({
        where: { id },
      });

      if (!maybeUser) return null;

      return maybeUser;
    } catch (error) {
      throw new Error("Database exception");
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const maybeUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!maybeUser) return null;

      return maybeUser;
    } catch (err) {
      throw new Error("Database exception");
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    try {
      const maybeUser = await this.prisma.user.findFirst({
        where: { username },
      });

      if (!maybeUser) return null;

      return maybeUser;
    } catch (error) {
      throw new Error("Database exception");
    }
  }

  async delete(email: string): Promise<void> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
      });

      if (!user) return;

      await this.prisma.$transaction([
        this.prisma.member.delete({
          where: {
            userId: user.id,
          },
        }),
        this.prisma.user.delete({ where: { email } }),
      ]);
    } catch (error) {
      throw new Error("Database exception");
    }
  }

  async update(
    id: number,
    props: Partial<ValidatedUser>,
  ): Promise<User | null> {
    try {
      const prismaUser = await this.prisma.user.update({
        where: { id },
        data: props,
      });
      return prismaUser;
    } catch (error) {
      throw new Error("Database exception");
    }
  }

  async save(userData: ValidatedUser): Promise<User & { password: string }> {
    try {
      const { email, firstName, lastName, username, password } = userData;
      return await this.prisma.$transaction(async () => {
        const user = await this.prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            username,
            password,
          },
        });

        await this.prisma.member.create({
          data: {
            userId: user.id,
          },
        });

        return user;
      });
    } catch (error) {
      console.error("error", error);
      throw new Error("Database exception");
    }
  }
}
