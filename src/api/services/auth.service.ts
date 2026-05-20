import { sql } from "../../db";
import type { RUser, User } from "../../types";
import bcrypt from "bcrypt";

class AuthService {
  async createUser(user: RUser & { password: string }) {
    // user  -> database -> return
    const { name, age, email, role, password } = user;

    const password_hash = await bcrypt.hash(password, 10);

    const res = await sql`
  INSERT INTO users(name, email, password_hash, age, role)
  VALUES(${name}, ${email}, ${password_hash}, ${age}, COALESCE(${role}, 'user'))
  RETURNING id, name, age, role
  `;

    return res[0];
  }

  async validateUser(email: string, password: string) {
    // if user exists
    const res = await sql`
    SELECT *
    -- id, name, email , passwordHash, age, role
      FROM users WHERE email = ${email}
    `;

    if (!res.length) {
      // throw new Error("Invalid Creadentials");
      return null;
    }
    //2. compare password

    const { password_hash, ...user } = res[0] as User;
    // console.log(password_hash);
    const isValid = await bcrypt.compare(password, password_hash);

    return isValid ? user : null;
  }
}

export default new AuthService();
