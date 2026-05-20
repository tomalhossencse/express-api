import config from "../config";
import type { User } from "../types";
import jwt from "jsonwebtoken";

export const signToken = (payload: User) => {
  // access token => data access
  //refresh token => generate access token again

  const accessToken = jwt.sign(payload, config.access_token_secret, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(payload, config.refresh_token_secret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
