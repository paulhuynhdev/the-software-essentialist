import { expect, beforeAll, afterEach, afterAll } from "@jest/globals";
import * as path from "path";
import { defineFeature, loadFeature } from "jest-cucumber";
import { sharedTestRoot } from "@dddforum/shared/src/paths";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";
import {
  CreateUserParams,
  CreateUserResponse,
} from "@dddforum/shared/src/api/users";
import { createAPIClient } from "@dddforum/shared/src/api";
import { CompositionRoot } from "@dddforum/backend/src/shared/compositionRoot";
import { WebServer } from "@dddforum/backend/src/shared/http/webServer";
import { Config } from "@dddforum/backend/src/shared/config";
import { Database } from "../../src/shared/database";
import { AddEmailToListResponse } from "@dddforum/shared/src/api/marketing";
import { InMemoryUsersRepositorySpy } from "@dddforum/backend/src/modules/users/adapters/InMemoryUsersRepositorySpy";
import { TransactionalEmailAPISpy } from "@dddforum/backend/src/modules/notifications/transactionalEmailAPISpy";
import { ContactListAPISpy } from "@dddforum/backend/src/modules/marketing/adapters/ContactListAPISpy";

const feature = loadFeature(
  path.join(sharedTestRoot, "features/registration.feature"),
);

defineFeature(feature, (test) => {
  let fakeUserRepo: InMemoryUsersRepositorySpy;
  let transactionalEmailAPISpy: TransactionalEmailAPISpy;
  let contactListAPISpy: ContactListAPISpy;
  const apiClient = createAPIClient("http://localhost:3000");
  let composition: CompositionRoot;
  let server: WebServer;
  const config: Config = new Config("test:unit");
  let response: CreateUserResponse;
  let createUserResponses: CreateUserResponse[] = [];
  let addEmailToListResponse: AddEmailToListResponse;
  let dbConnection: Database;

  beforeAll(async () => {
    composition = CompositionRoot.createCompositionRoot(config);
    server = composition.getWebServer();
    fakeUserRepo = InMemoryUsersRepositorySpy.getInstance();
    transactionalEmailAPISpy = TransactionalEmailAPISpy.getInstance();
    contactListAPISpy = ContactListAPISpy.getInstance();
    dbConnection = composition.getDBConnection();

    await server.start();
    await dbConnection.connect();
  });

  afterEach(async () => {
    await fakeUserRepo.reset();
    await transactionalEmailAPISpy.reset();
    await contactListAPISpy.reset();
    createUserResponses = [];
    addEmailToListResponse = {
      success: false,
      data: false,
      error: { message: "ServerError" },
    };
  });

  afterAll(async () => {
    await server.stop();
  });

  test("Successful registration with marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let user: CreateUserParams;

    given("I am a new user", async () => {
      user = new CreateUserBuilder().withAllRandomDetails().build();
    });

    when(
      "I register with valid account details accepting marketing emails",
      async () => {
        response = await apiClient.users.register(user);
        addEmailToListResponse = await apiClient.marketing.addEmailToList(
          user.email,
        );
      },
    );

    then("I should be granted access to my account", async () => {
      const { data, success, error } = response;

      expect(success).toBeTruthy();
      expect(error).toEqual({});
      expect(data!.id).toBeDefined();
      expect(data!.email).toEqual(user.email);
      expect(data!.firstName).toEqual(user.firstName);
      expect(data!.lastName).toEqual(user.lastName);
      expect(data!.username).toEqual(user.username);

      const getUserResponse = await apiClient.users.getUserByEmail(user.email);
      const { data: getUserData } = getUserResponse;
      expect(user.email).toEqual(getUserData!.email);
    });

    and("I should expect to receive marketing emails", () => {
      const { success } = addEmailToListResponse;

      expect(success).toBeTruthy();

      expect(contactListAPISpy.getTimesMethodCalled("addEmailToList")).toEqual(
        1,
      );
    });
  });

  test("Successful registration without marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let user: CreateUserParams;

    given("I am a new user", () => {
      user = new CreateUserBuilder().withAllRandomDetails().build();
    });

    when(
      "I register with valid account details declining marketing emails",
      async () => {
        response = await apiClient.users.register(user);
      },
    );

    then("I should be granted access to my account", async () => {
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data!.email).toBe(user.email);
      expect(response.data!.username).toBe(user.username);
      expect(response.data!.firstName).toBe(user.firstName);
      expect(response.data!.lastName).toBe(user.lastName);
      expect(response.data!.id).toBeDefined();

      const getUserResponse = await apiClient.users.getUserByEmail(user.email);
      expect(user.email).toEqual(getUserResponse.data!.email);

      expect(fakeUserRepo.getTimesMethodCalled("save")).toEqual(1);

      expect(transactionalEmailAPISpy.getTimesMethodCalled("sendMail")).toEqual(
        1,
      );
    });

    and("I should not expect to receive marketing emails", () => {
      const { success } = addEmailToListResponse;
      expect(success).toBeFalsy();

      expect(contactListAPISpy.getTimesMethodCalled("addEmailToList")).toEqual(
        0,
      );
    });
  });

  test("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    let user: any;

    given("I am a new user", () => {
      const validUser = new CreateUserBuilder().withAllRandomDetails().build();

      user = {
        firstName: validUser.firstName,
        email: validUser.email,
        lastName: validUser.lastName,
      };
    });

    when("I register with invalid account details", async () => {
      response = await apiClient.users.register(user);
    });

    then("I should see an error notifying me that my input is invalid", () => {
      expect(response.success).toBe(false);
      expect(response.data).toBeNull();
      expect(response.error).toBeDefined();
    });

    and("I should not have been sent access to account details", () => {
      expect(response.success).toBe(false);
      expect(response.data).toBeNull();
      expect(response.error).toBeDefined();
    });
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    let existingUsers: CreateUserParams[] = [];

    given("a set of users already created accounts", async (table) => {
      existingUsers = table.map((row: any) => {
        return new CreateUserBuilder()
          .withAllRandomDetails()
          .withFirstName(row.firstName)
          .withLastName(row.lastName)
          .withEmail(row.email)
          .build();
      });

      await Promise.all(existingUsers.map((user) => fakeUserRepo.save(user)));
    });

    when("new users attempt to register with those emails", async () => {
      createUserResponses = await Promise.all(
        existingUsers.map((user) => {
          return apiClient.users.register(user);
        }),
      );
    });
    then(
      "they should see an error notifying them that the account already exists",
      () => {
        for (const response of createUserResponses) {
          expect(response.error).toBeDefined();
          expect(response.success).toBeFalsy();
          expect(response.error.code).toEqual("EmailAlreadyInUse");
        }
      },
    );

    and("they should not have been sent access to account details", () => {
      createUserResponses.forEach((response) => {
        expect(response.success).toBe(false);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      });
    });
  });

  test("Username already taken", ({ given, when, then, and }) => {
    let existingUsers: CreateUserParams[] = [];
    let newRegistrationAttempts: CreateUserParams[] = [];

    given(
      "a set of users have already created their accounts with valid details",
      async (table) => {
        existingUsers = table.map((row: any) => {
          return new CreateUserBuilder()
            .withAllRandomDetails()
            .withFirstName(row.firstName)
            .withLastName(row.lastName)
            .withEmail(row.email)
            .withUsername(row.username)
            .build();
        });

        await Promise.all(existingUsers.map((user) => fakeUserRepo.save(user)));
      },
    );

    when(
      "new users attempt to register with already taken usernames",
      async () => {
        newRegistrationAttempts = existingUsers.map((existingUser) => {
          return new CreateUserBuilder()
            .withAllRandomDetails()
            .withUsername(existingUser.username)
            .build();
        });

        createUserResponses = await Promise.all(
          newRegistrationAttempts.map((user) => apiClient.users.register(user)),
        );
      },
    );

    then(
      "they see an error notifying them that the username has already been taken",
      () => {
        createUserResponses.forEach((response) => {
          expect(response.success).toBeFalsy();
          expect(response.data).toBeNull();
          expect(response.error.code).toEqual("UsernameAlreadyTaken");
        });
      },
    );

    and("they should not have been sent access to account details", () => {
      createUserResponses.forEach((response) => {
        expect(response.success).toBe(false);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      });
    });
  });
});
