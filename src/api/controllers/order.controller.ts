import type { Request, Response } from "express";
import orderService from "../services/order.service";
import type { NewOrder, Order } from "../../types";
import { sendResponse } from "../../utils/sendResponse";

export const createOrder = async (req: Request, res: Response) => {
  const orderInfo: NewOrder = req.body;
  const newOrder = (await orderService.createOrder(orderInfo)) as Order;

  sendResponse(res, {
    message: "Orders Created Succesfuly",
    data: newOrder,
  });
};

export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await orderService.getAllOrders();
  sendResponse(res, {
    message: "Orders retrieved successfully",
    data: orders,
  });
};
