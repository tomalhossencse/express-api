export const role = ["admin", "super_admin", "user"] as const;

export type Role = (typeof role)[number];

export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  age: number;
  role: Role;
  created_at: Date;
  update_at: Date;
};

export type RUser = Omit<
  User,
  "id" | "created_at" | "update_at" | "password_hash"
>;

// export type jwtPayload = {
//   id: number;
//   name: string;
//   email: string;

//   age: number;
//   role: Role;
// };

export type Order = {
  id: number;
  customer_id: number;
  quantity: number;
  food: string;
  price: number;
  created_at: Date;
  update_at: Date;
};
