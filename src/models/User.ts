import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import { UserT, UserMethodsT, UserModelT } from "../types/models/user.types";
import { USER_DEFAULT_AVATAR } from "../config/config";

const UserSchema = new Schema<UserT, UserModelT, UserMethodsT>(
  {
    username: {
      type: String,
      unique: true,
    },

    avatar: {
      type: String,
    },

    password: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.avatar) return next();

  this.avatar = USER_DEFAULT_AVATAR;

  next();
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  return next();
});

UserSchema.methods.checkPassword = async function (
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};

const User = model<UserT, UserModelT>("User", UserSchema);

export default User;
