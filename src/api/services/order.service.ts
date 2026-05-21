import type { NewOrder } from "../../types";
import authService from "./auth.service";
import { sql } from "../../db";

class OrderService {
  async createOrder(orderInfo: NewOrder) {
    const { customer_id, food, price, quantity } = orderInfo;
    const user = await authService.getUserById(customer_id);

    if (!user) {
      throw new Error("Users not found");
    }

    const res = await sql`
        INSERT INTO orders (customer_id, food,quantity,price )
        VALUES(${customer_id}, ${food}, ${quantity}, ${price})
        RETURNING *
    `;

    return res[0];
  }

  async getAllOrders() {
    const orders = await sql`
    SELECT * FROM orders
    `;
    return orders;
  }
}

export default new OrderService();
