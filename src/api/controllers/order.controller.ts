import type { Request, Response } from "express";
import orderService from "../services/order.service";
import { sendResponse } from "../../utils/sendResponse";

export const createOrder = async (req: Request, res: Response) => {
  const orderInfo = req.body;
  const newOrder = await orderService.createOrder(orderInfo);

  if (!newOrder) {
    return sendResponse(
      res,
      {
        message: "Orders not created",
        error: true,
      },
      404,
    );
  }

  sendResponse(res, {
    message: "Orders Created Succesfuly",
    data: newOrder,
  });
};

export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await orderService.getAllOrders();
  if (!orders.length) {
    return sendResponse(
      res,
      {
        message: "Orders not found",
        error: true,
      },
      404,
    );
  }
  sendResponse(res, {
    message: "Orders retrieved successfully",
    data: orders,
  });
};

export const deleteAllOrders = async (req: Request, res: Response) => {
  const deleted = await orderService.deleteAllOrders();
  if (!deleted.length) {
    return sendResponse(
      res,
      {
        message: "Orders not found",
        error: true,
      },
      404,
    );
  }
  sendResponse(res, {
    message: "All orders deleted successfully",
  });
};
