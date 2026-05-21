import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "./sendResponse";
import { verifyToken } from "./jwt";
import authService from "../api/services/auth.service";
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return sendResponse(
      res,
      {
        message: "token not found",
      },
      401,
    );
  }

  // 2. validate refresh token
  const payload = verifyToken(token, "access");

  if (!payload) {
    return sendResponse(
      res,
      {
        message: "Invalid  token",
      },
      401,
    );
  }

  // 3. need user information to check exists or not

  const user = await authService.getUserById(payload.id);
  // console.log(user);

  if (!user) {
    return sendResponse(
      res,
      {
        message: "User not found",
      },
      401,
    );
  }

  req.user = user;
  next();
};
