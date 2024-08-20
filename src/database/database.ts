import mongoose from "mongoose";

export const enum Collection {
  Users = "users",
}

export class MongoDB {
  private static _instance: MongoDB;

  private constructor() {}

  // Singleton pattern
  static get instance() {
    mongoose.set("transactionAsyncLocalStorage", true);
    if (this._instance) return this._instance;
    this._instance = new MongoDB();
    return this._instance;
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(process.env["DATABASE_URI"] as string, {
        dbName: process.env["DATABASE_NAME"] as string,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
