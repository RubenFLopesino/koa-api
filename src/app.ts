import { AppServer } from "./server/server";
import { MongoDB } from "./database/database";

MongoDB.instance.connect().then(() => {
  AppServer.initServer();
});
