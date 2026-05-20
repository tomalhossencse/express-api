import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { logger } from "./middleware/logger";
import { globlaError } from "./middleware/globalErrorHandler";
import authRoutes from "./api/routes/auth.route";
const app: Application = express();

app.use(logger);
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", async (req: Request, res: Response) => {
  // throw new Error("Server is dying");
  res.send("Hello world ");
});

app.use(globlaError);

export default app;
