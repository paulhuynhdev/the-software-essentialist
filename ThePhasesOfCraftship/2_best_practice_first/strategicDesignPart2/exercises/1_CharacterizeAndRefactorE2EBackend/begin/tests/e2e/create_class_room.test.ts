import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import { http } from "../../src/index";
import path from "path";
import {
  expect,
  afterEach,
  afterAll,
  beforeAll,
  beforeEach,
} from "@jest/globals";
import { resetDatabase } from "../fixtures/reset";
import { faker } from "@faker-js/faker";
import { RESTfulAPIDriver } from "../../shared/http/resfulAPIDriver";
import { WebServer } from "../../shared/http/webServer";
import { Server } from "http";

// type CreateClassInput = {
//   name: string;
// }

const feature = loadFeature(
  path.join(__dirname, "../features/createClassRoom.feature")
);

defineFeature(feature, (test) => {
  let webServer: WebServer = new WebServer();
  let driver: RESTfulAPIDriver;

  beforeAll(async () => {
    // Start the server
    await webServer.start();

    driver = new RESTfulAPIDriver(webServer.getHttp() as Server);
    // Clear out the database (reset it)
    await resetDatabase();
  });

  afterAll(async () => {
    // Stop the server
    await webServer.stop();
  });

  test("Successfully create a class room", ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};

    given(/^I want to create a class room named "(.*)"$/, (name) => {
      // const uniqueName = faker.lorem.word() + faker.string.uuid();
      requestBody = {
        name: name,
      };
    });

    when("I send a request to create a class room", async () => {
      response = await driver.post("/classes", requestBody);
    });

    then("the class room should be created successfully", () => {
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(requestBody.name);
    });
  });

  test("Fail to create a class room", ({ given, when, then }) => {
    given("I want to create a class room with no name", () => {});

    when("I send a request to create a class room", () => {});

    then("the class room should not be created", () => {});
  });
});
