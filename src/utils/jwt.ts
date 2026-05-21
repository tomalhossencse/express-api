import config from "../config";
import type { RUser, User } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const signToken = (payload: JwtPayload) => {
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

export const verifyToken = (token: string, type: "access" | "refresh") => {
  const secrect =
    type === "access"
      ? config.access_token_secret
      : config.refresh_token_secret;

  const decode = jwt.verify(token, secrect);
  return decode as RUser & { id: number };
};
