import { CompositionRoot } from "@dddforum/backend/src/shared/compositionRoot";
import { Config } from "@dddforum/backend/src/shared/config";
import { createAPIClient } from "@dddforum/shared/src/api";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";
import {
  describe,
  it,
  expect,
  jest,
  beforeAll,
  afterEach,
  afterAll,
} from "@jest/globals";

describe("users HTTP API", () => {
  const apiClient = createAPIClient("http://localhost:3000");
  const config = new Config("test:infra");

  const composition = CompositionRoot.createCompositionRoot(config);
  const server = composition.getWebServer();

  const application = composition.getApplication();

  let createUserSpy: any;

  beforeAll(async () => {
    await server.start();
    createUserSpy = jest.spyOn(application.user, "createUser");
  });

  afterEach(() => {
    createUserSpy.mockClear();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("can create users", async () => {
    const createUserInput = new CreateUserBuilder()
      .makeValidatedUserBuilder()
      .withAllRandomDetails()
      .withFirstName("John")
      .withLastName("Doe")
      .build();

    const createUserResponseStub = new CreateUserBuilder()
      .makeValidatedUserBuilder()
      .withEmail(createUserInput.email)
      .withFirstName(createUserInput.firstName)
      .withLastName(createUserInput.lastName)
      .withUsername(createUserInput.username)
      .build();

    createUserSpy.mockResolvedValue(createUserResponseStub);

    await apiClient.users.register(createUserInput);

    expect(application.user.createUser).toHaveBeenCalledTimes(1);
  });
});
