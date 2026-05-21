import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { logger } from "./middleware/logger";
import { globlaError } from "./middleware/globalErrorHandler";
import authRoutes from "./api/routes/auth.route";
import orderRoutes from "./api/routes/order.route";
import cookieParser from "cookie-parser";
const app: Application = express();

app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/order", orderRoutes);

app.get("/", async (req: Request, res: Response) => {
  // throw new Error("Server is dying");
  res.send("Hello world ");
});

app.use(globlaError);

export default app;
