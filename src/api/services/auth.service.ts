import { sql } from "../../db";
import type { RUser, User } from "../../types";
import bcrypt from "bcrypt";

class AuthService {
  private async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

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

  async getUserById(id: number) {
    const res = await sql`
    SELECT id, name,email, role, age FROM users
    WHERE id = ${id}
`;

    return res[0] as RUser & { id: number };
  }

  async updateUserIntoDb(
    userId: number,
    updates: Partial<RUser> & {
      password?: string;
    },
  ) {
    const { age, email, name, password, role } = updates;

    let passwordHash: string | undefined;

    if (password) {
      passwordHash = await this.hashPassword(password);
    }

    const result = await sql`
    UPDATE users
    SET
      name = COALESCE(${name}, name),
      email = COALESCE(${email}, email),
      age = COALESCE(${age}, age),
      role = COALESCE(${role}, role),
      password_hash = COALESCE(${passwordHash}, password_hash),
      updated_at = NOW()
     WHERE id = ${userId}
     RETURNING id, name, email, age, role, created_at, updated_at

    `;
    return result[0];
  }

  async deleteUserFromDb(userId: number) {
    try {
      await sql`
      DELETE FROM users
      WHERE id= ${userId}
      `;
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();
