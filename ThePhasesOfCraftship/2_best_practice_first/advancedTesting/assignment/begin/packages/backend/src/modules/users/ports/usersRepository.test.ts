import { describe, it, expect } from "@jest/globals";
import { UsersRepository } from "./usersRepository";
import { ProductionUsersRepository } from "../adapters/productionUsersRepository";
import { PrismaClient } from "@prisma/client";
import { CreateUserCommandBuilder } from "@dddforum/shared/tests/support/builders/createUserCommandBuilder";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";
import { InMemoryUsersRepositorySpy } from "../adapters/InMemoryUsersRepositorySpy";

describe("UsersRepository", () => {
  const userRepos: UsersRepository[] = [
    new ProductionUsersRepository(new PrismaClient()),
    new InMemoryUsersRepositorySpy(),
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

  it("should return null when username does not exist", async () => {
    await Promise.all(
      userRepos.map(async (userRepo) => {
        const nonExistentUsername = "nonexistentuser123";
        const foundUser =
          await userRepo.findUserByUsername(nonExistentUsername);

        expect(foundUser).toBeNull();
      }),
    );
  });

  it("should return all users when users exist", async () => {
    await Promise.all(
      userRepos.map(async (userRepo) => {
        const user1 = new CreateUserBuilder()
          .makeValidatedUserBuilder()
          .withAllRandomDetails()
          .build();
        const user2 = new CreateUserBuilder()
          .makeValidatedUserBuilder()
          .withAllRandomDetails()
          .build();

        await userRepo.save(user1);
        await userRepo.save(user2);

        const allUsers = await userRepo.findAll();

        expect(allUsers.length).toBeGreaterThanOrEqual(2);
        expect(allUsers.some((u) => u.email === user1.email)).toBeTruthy();
        expect(allUsers.some((u) => u.email === user2.email)).toBeTruthy();
      }),
    );
  });

  it("should return user when email exists", async () => {
    await Promise.all(
      userRepos.map(async (userRepo) => {
        const testUser = new CreateUserBuilder()
          .makeValidatedUserBuilder()
          .withAllRandomDetails()
          .build();

        await userRepo.save(testUser);
        const foundUser = await userRepo.findUserByEmail(testUser.email);

        expect(foundUser).toBeDefined();
        expect(foundUser?.email).toBe(testUser.email);
        expect(foundUser?.username).toBe(testUser.username);
      }),
    );
  });

  it("should return null when email does not exist", async () => {
    await Promise.all(
      userRepos.map(async (userRepo) => {
        const nonExistentEmail = "nonexistent@example.com";
        const foundUser = await userRepo.findUserByEmail(nonExistentEmail);

        expect(foundUser).toBeNull();
      }),
    );
  });
});
