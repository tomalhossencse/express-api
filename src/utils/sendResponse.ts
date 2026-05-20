import type { Response } from "express";

export const sendResponse = async <T>(
  res: Response,
  {
    message,
    data,
    error,
  }: {
    message: unknown;
    data: T;
    error?: boolean;
  },
  status = 200,
) => {
  res.status(status).json({
    success: error ? false : true,
    message: message,
    data: error ? undefined : data,
  });
};
