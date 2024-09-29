import path from "path";
import request from "supertest";
import { defineFeature, loadFeature } from "jest-cucumber";
import { app } from "@dddforum/backend/src/shared/bootstrap";
import { sharedTestRoot } from "@dddforum/shared/src/paths";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";
import { CreateUserParams, CreateUserResponse } from "@dddforum/shared/src/api/users";
import { DatabaseFixture } from "@dddforum/shared/tests/support/fixtures/databaseFixture";
import { ErrorExceptionType } from "../../src/shared/constants";
import { createAPIClient } from "@dddforum/shared/src/api";
import { AddEmailToListResponse } from "@dddforum/shared/src/api/marketing";
import { CompositionRoot } from "@dddforum/backend/src/shared/composition/compositionRoot";
import { WebServer } from "@dddforum/backend/src/shared/http/webServer";
import { Config } from "@dddforum/backend/src/shared/config";
import { Database } from "@dddforum/backend/src/shared/database";

const feature = loadFeature(path.join(sharedTestRoot, "features/registration.feature"), {
  tagFilter: "@backend and not @excluded",
});

defineFeature(feature, (test) => {
  let databaseFixture: DatabaseFixture;
  const apiClient = createAPIClient('http://localhost:3000');
  let composition: CompositionRoot;
  let server: WebServer;
  const config: Config = new Config("test:e2e");
  let createUserResponses: CreateUserResponse[] = [];
  let dbConnection: Database;

  beforeAll(async () => {
    composition = CompositionRoot.createCompositionRoot(config);
    server = composition.getWebServer();
    databaseFixture = new DatabaseFixture();
    dbConnection = composition.getDBConnection();

    await server.start();
    await dbConnection.connect();
  });

  afterEach(async () => {
    await databaseFixture.resetDatabase();
    createUserResponses = []
  });

  afterAll(async () => {
    await server.stop();
  });

  test("Successful registration with marketing emails accepted", ({ given, when, then, and }) => {
    let user: CreateUserParams;
    let response: CreateUserResponse;
    let addEmailToListResponse: AddEmailToListResponse;

    given('I am a new user', async () => {
      user = new CreateUserBuilder()
        .withAllRandomDetails()
        .build();
    });

    when('I register with valid account details accepting marketing emails', async () => {
      response = await apiClient.users.register(user);
      addEmailToListResponse = await apiClient.marketing.addEmailToList(user.email);
    });
    then('I should be granted access to my account', async () => {
      const { data, success, error } = response;

      // Expect a successful response (Result Verification)
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(data!.id).toBeDefined();
      expect(data!.email).toEqual(user.email);
      expect(data!.firstName).toEqual(user.firstName);
      expect(data!.lastName).toEqual(user.lastName);
      expect(data!.username).toEqual(user.username);

      // And the user exists (State Verification)
      const getUserResponse = await apiClient.users.getUserByEmail(user.email);
      const { data: getUserData } = getUserResponse;
      console.log(getUserData)

      expect(user.email).toEqual(getUserData!.email);
    });

    and('I should expect to receive marketing emails', () => {
      const { success } = addEmailToListResponse;
      expect(success).toBeTruthy();
    });
  });

  test("Successful registration", ({ given, when, then }) => {
    let user: CreateUserParams;
    let response: request.Response;

    given("I am a new user", () => {
      user = new CreateUserBuilder().withAllRandomDetails().build();
    });

    when("I register with valid account details", async () => {
      response = await request(app).post("/users/new").send(user);
    });
    then("I should be granted access to my account", () => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.username).toBe(user.username);
      expect(response.body.data.firstName).toBe(user.firstName);
      expect(response.body.data.lastName).toBe(user.lastName);
      expect(response.body.data.id).toBeDefined();
    });
  });

  test("Invalid or missing registration details", ({ given, when, then, and }) => {
    let user: any;
    let response: request.Response;

    given("I am a new user", () => {
      const validUser = new CreateUserBuilder().withAllRandomDetails().build();

      user = {
        firstName: validUser.firstName,
        email: validUser.email,
        lastName: validUser.lastName,
      };
    });

    when("I register with invalid account details", async () => {
      response = await request(app).post("/users/new").send(user);
    });
    then("I should see an error notifying me that my input is invalid", () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.data).toBeNull();
      expect(response.body.error).toBeDefined();
    });

    and("I should not have been sent access to account details", () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.data).toBeNull();
      expect(response.body.error).toBeDefined();
    });
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    let existingUsers: CreateUserParams[] = [];
    let createUserResponses: request.Response[] = [];

    given("a set of users already created accounts", async (table) => {
      existingUsers = table.map((row: any) => {
        return new CreateUserBuilder()
          .withFirstName(row.firstName)
          .withLastName(row.lastName)
          .withEmail(row.email)
          .build();
      });
      await databaseFixture.setupWithExistingUsers(existingUsers);
    });

    when("new users attempt to register with those emails", async () => {
      createUserResponses = await Promise.all(
        existingUsers.map((user) => {
          return request(app).post("/users/new").send(user);
        })
      );
    });

    then("they should see an error notifying them that the account already exists", () => {
      for (const { body } of createUserResponses) {
        expect(body.error).toBeDefined();
        expect(body.success).toBeFalsy();
        expect(body.error.code).toEqual('EmailAlreadyInUse');
      }
    });

    and("they should not have been sent access to account details", () => {
      createUserResponses.forEach((response) => {
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.data).toBeNull();
        expect(response.body.error).toBeDefined();
      });
    });
  });

  test("Username already taken", ({ given, when, then, and }) => {
    let existingUsers: CreateUserParams[] = [];
    let createUserResponses: request.Response[] = [];

    given(
      "a set of users have already created their accounts with valid details",
      async (table) => {
        existingUsers = table.map((row: any) => {
          return new CreateUserBuilder()
            .withFirstName(row.firstName)
            .withLastName(row.lastName)
            .withEmail(row.email)
            .withUsername(row.username)
            .build();
        });
        await databaseFixture.setupWithExistingUsers(existingUsers);
      }
    );

    when("new users attempt to register with already taken usernames", async (table) => {
      const newUsers: CreateUserParams[] = table.map((row: any) => {
        return new CreateUserBuilder()
          .withFirstName(row.firstName)
          .withLastName(row.lastName)
          .withEmail(row.email)
          .withUsername(row.username)
          .build();
      });

      createUserResponses = await Promise.all(
        newUsers.map((user) => {
          return request(app).post("/users/new").send(user);
        })
      );
    });

    then("they see an error notifying them that the username has already been taken", () => {
      for (const { body } of createUserResponses) {
        expect(body.error).toBeDefined();
        expect(body.success).toBeFalsy();
        expect(body.error.code).toEqual(ErrorExceptionType.UsernameAlreadyTaken);
      }
    });

    and("they should not have been sent access to account details", () => {
      createUserResponses.forEach((response) => {
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.data).toBeNull();
        expect(response.body.error).toBeDefined();
      });
    });
  });
});
