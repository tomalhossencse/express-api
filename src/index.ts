import app from "./app";
import config from "./config";
import { initDB } from "./db";

const main = async () => {
  app.listen(config.port, () => {
    initDB();
    console.log(`server is runing on port ${config.port}`);
  });
};

main();
