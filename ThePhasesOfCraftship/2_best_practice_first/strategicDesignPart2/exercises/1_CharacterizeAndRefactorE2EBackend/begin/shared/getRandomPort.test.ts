import { describe, it, expect } from "@jest/globals";
import { getRandomPort } from "./getRandomPort";
import * as net from "net";

describe("getRandomPort", () => {
  it("should return a valid and available port", async () => {
    const port = await getRandomPort();

    // Check that the port is within the valid range for dynamic ports (1024-65535)
    expect(port).toBeGreaterThanOrEqual(1024);
    expect(port).toBeLessThanOrEqual(65535);

    // Verify that the port is available by trying to create a server on that port
    const server = net.createServer();
    await new Promise<void>((resolve, reject) => {
      server.once("error", (err) => reject(err)); // If the port is taken, this will trigger an error
      server.listen(port, () => resolve()); // Adjusted the callback to resolve without arguments
    });

    server.close(); // Clean up the server after the test
  });

  it("should return different ports on consecutive calls", async () => {
    const port1 = await getRandomPort();
    const port2 = await getRandomPort();

    // Check that two consecutive calls return different ports
    expect(port1).not.toEqual(port2);
  });
});
