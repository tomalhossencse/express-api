import type { Request, Response } from "express";
import authService from "../services/auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { signToken, verifyToken } from "../../utils/jwt";
import type { User } from "../../types";

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

  const { accessToken, refreshToken } = signToken(user);

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

export const refresh = async (req: Request, res: Response) => {
  // 1. get refresh token
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return sendResponse(
      res,
      {
        message: "refresh token not found",
      },
      401,
    );
  }

  // 2. validate refresh token
  const payload = verifyToken(refreshToken, "refresh");

  if (!payload) {
    return sendResponse(
      res,
      {
        message: "Invalid refresh token",
      },
      401,
    );
  }
  // console.log(payload.id);

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

  // 4. make another access token base user

  const { accessToken, refreshToken: newRefreshtoken } = signToken(user);

  res.cookie("refreshToken", newRefreshtoken, {
    secure: false,
    sameSite: "lax",
    httpOnly: true,
  });

  sendResponse(res, {
    message: "Token refreshed",
    data: {
      newRefreshtoken,
      accessToken,
    },
  });
};
