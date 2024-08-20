import bcrypt from "bcrypt";
import { connection } from "mongoose";
import UserModel, { User } from "./user.document";

export class UserService {
  private static readonly saltRounds = 10;

  private static readonly salt = bcrypt.genSaltSync(this.saltRounds);

  static async register(data: User): Promise<User> {
    try {
      return await connection.transaction<User>(async () => {
        // TODO => Send verification code to email to use verify endpoint from link

        const user = new UserModel({
          ...data,
          password: bcrypt.hashSync(data.password, this.salt),
        });
        return await user.save();
      });
    } catch (error) {
      throw error;
    }
  }

  static async verify(verificationCode: string): Promise<User | null> {
    try {
      return await connection.transaction<User | null>(async () => {
        const user = await UserModel.findOne({ verificationCode });
        if (!user) return null;
        user.isVerified = true;
        await user.save();
        return user;
      });
    } catch (error) {
      throw error;
    }
  }

  static async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | null> {
    try {
      return await connection.transaction<User | null>(async () => {
        const user = await UserModel.findOne({ email });
        if (user) {
          return bcrypt.compareSync(password, user.password) && user.isVerified
            ? user
            : null;
        }
        return null;
      });
    } catch (error) {
      throw error;
    }
  }
}
