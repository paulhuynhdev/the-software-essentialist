import { describe, it, expect } from "@jest/globals";
import { UsersRepository } from "./usersRepository";
import { ProductionUsersRepository } from "../adapters/productionUsersRepository";
import { PrismaClient } from "@prisma/client";
import { CreateUserCommandBuilder } from "@dddforum/shared/tests/support/builders/createUserCommandBuilder";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";
describe("UsersRepository", () => {
  const userRepos: UsersRepository[] = [
    new ProductionUsersRepository(new PrismaClient()),
  ];

  it("can save and retrieve a user by email", async () => {
    const createUserInput = new CreateUserBuilder()
      .makeValidatedUserBuilder()
      .withAllRandomDetails()
      .build();

    await Promise.all(
      userRepos.map(async (userRepo) => {
        const savedUserResult = await userRepo.save(createUserInput);
        const fetchedUserResult = await userRepo.findUserByEmail(
          createUserInput.email,
        );

        expect(savedUserResult).toBeDefined();
        expect(fetchedUserResult).toBeDefined();
        expect(fetchedUserResult?.email).toBe(savedUserResult.email);
      }),
    );
  });

  it("can find a user by username", async () => {
    const createUserInput = new CreateUserCommandBuilder()
      .withAllRandomDetails()
      .build();

    await Promise.all(
      userRepos.map(async (userRepo) => {
        const savedUserResult = await userRepo.save(createUserInput);
        const fetchedUserResult = await userRepo.findUserByUsername(
          createUserInput.username,
        );

        expect(savedUserResult).toBeDefined();
        expect(fetchedUserResult).toBeDefined();
        expect(fetchedUserResult?.username).toBe(savedUserResult.username);
      }),
    );
  });
});
