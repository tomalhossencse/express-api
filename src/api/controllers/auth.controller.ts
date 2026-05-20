import type { Request, Response } from "express";
import authService from "../services/auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { signToken } from "../../utils/jwt";
import type { RUser, User } from "../../types";

export const signup = async (req: Request, res: Response) => {
  const user = await authService.createUser(req.body);
  if (!user) {
    return sendResponse(res, { message: "Failed to create user" }, 400);
  }
  sendResponse(res, { message: "User created Succesfuly!", data: user }, 201);
};

export const login = async (req: Request, res: Response) => {
  //  check if the exists
  // password match or not
  // generate token
  //it mean we need to user valide and sign in token
  const { email, password } = req.body;

  const user = await authService.validateUser(email, password);

  if (!user) {
    return sendResponse(
      res,
      {
        message: "Invalid Email and password",
      },
      401,
    );
  }

  const { accessToken, refreshToken } = signToken(user as User);

  res.cookie("refreshToken", refreshToken, {
    sameSite: "lax",
    httpOnly: true,
    secure: false,
  });

  const result = {
    user,
    accessToken,
    refreshToken,
  };

  return sendResponse(res, {
    message: "user Login Successfully",
    data: result,
  });
};
