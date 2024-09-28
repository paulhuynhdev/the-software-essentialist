import { ErrorHandler } from "../errors";
import { Config } from "../config";

import { CompositionRoot } from "../composition/compositionRoot";


const config = new Config("start");
const composition = CompositionRoot.createCompositionRoot(config);
const webServer = composition.getWebServer();
const dbConnection = composition.getDBConnection();

export async function bootstrap() {
  await dbConnection.connect();
  await webServer.start();
}

export const app = webServer.getApplication();
export const database = dbConnection;
