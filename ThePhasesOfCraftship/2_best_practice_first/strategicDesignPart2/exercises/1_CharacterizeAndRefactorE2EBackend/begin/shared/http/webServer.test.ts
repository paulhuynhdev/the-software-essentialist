import {
  afterEach,
  beforeEach,
  describe,
  it,
  expect,
  test,
} from "@jest/globals";
import { WebServer } from "./webServer";

describe("webServer", () => {
  let webServer = new WebServer();

  beforeEach(async () => {
    await webServer.stop();
  });

  afterEach(async () => {
    await webServer.stop();
  });

  it("can start", async () => {
    await webServer.start();
    expect(webServer);
  });

  test("once started, it can be stopped", async () => {
    await webServer.start();
    await webServer.stop();
    expect(webServer.isRunning()).toBeFalsy();
  });
});
