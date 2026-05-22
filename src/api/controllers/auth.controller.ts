import type { Request, Response } from "express";
import authService from "../services/auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { signToken, verifyToken } from "../../utils/jwt";

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
    secure: false,
    httpOnly: true,
    sameSite: "lax",
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
        error: true,
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

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return sendResponse(
      res,
      {
        message: "No active session found",
        error: true,
      },
      400,
    );
  }

  res.clearCookie("refreshToken", {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  });

  sendResponse(
    res,
    {
      message: "Logout Successfully",
    },
    200,
  );
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization as string;

  if (!accessToken) {
    return sendResponse(
      res,
      {
        message: "unauthorized access",
        error: true,
      },
      401,
    );
  }
  const userId = verifyToken(accessToken, "access")?.id;

  const user = await authService.getUserById(userId);

  if (!user) {
    return sendResponse(
      res,
      {
        message: "User not found",
        error: true,
      },
      404,
    );
  }

  sendResponse(
    res,
    {
      message: "User fetched Succesfuly",
      data: user,
    },
    200,
  );
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(
      res,
      {
        message: "User not found",
        error: true,
      },
      404,
    );
  }

  const { name, email, age, password } = req.body;

  const updated = await authService.updateUserIntoDb(userId, {
    name,
    email,
    age,
    password,
  });

  if (!updated) {
    return sendResponse(
      res,
      { message: "Failed to update user", error: true },
      400,
    );
  }

  sendResponse(
    res,
    {
      message: "User Updated Succesfuly",
      data: updated,
    },
    200,
  );
};
