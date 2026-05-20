import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { logger } from "./middleware/logger";

const app: Application = express();

app.use(logger);

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello world ");
});

export default app;
