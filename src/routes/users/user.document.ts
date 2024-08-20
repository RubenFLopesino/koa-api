import { Schema, Model, model } from "mongoose";
import { Collection } from "../../database/database";
import { v4 as uuid } from "uuid";

export enum Role {
  Admin = "admin",
  User = "user",
}

interface Place {
  lat: string;
  lng: string;
}

interface Vehicle {
  brand: string;
  plate: string;
  color: string;
  model: string;
}

interface Ratings {
  stars: number;
  review: string;
}

export interface User {
  name: string;
  lastName: string;
  birthDate: Date;
  email: string;
  phone: number;
  workPlace: Place;
  originPlace: Place;
  password: string;
  vehicles?: Vehicle[];
  ratings?: Ratings[];
  role?: Role;
  isVerified?: boolean;
  verificationCode?: string;
}

const userSchema = new Schema<User, Model<User>>(
  {
    name: { required: true, type: String },
    lastName: { required: true, type: String },
    birthDate: { required: true, type: Date },
    email: { required: true, type: String, unique: true },
    phone: { required: true, type: Number, unique: true },
    workPlace: { required: true, type: Object },
    originPlace: { required: true, type: Object },
    vehicles: [{ type: Object, default: [] }],
    ratings: [{ type: Object, default: [] }],
    password: { required: true, type: String },
    role: {
      required: true,
      type: String,
      enum: Object.values(Role).map((value) => value),
      default: Role.User,
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: uuid },
  },
  { versionKey: false },
);

const UserModel: Model<User> = model<User, Model<User>>(
  Collection.Users,
  userSchema,
);

export default UserModel;
