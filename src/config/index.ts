import dotenv from "dotenv";
import { env } from "process";
dotenv.config({ quiet: true });

const config = {
  port: env.PORT as string,
  database_url: env.DATABASE_URL as string,
  node_env: env.NODE_ENV as string,
  access_token_secret: env.ACCESS_TOKEN_SECRET as string,
  refresh_token_secret: env.REFRESH_TOKEN_SECRET as string,
};

export default config;
