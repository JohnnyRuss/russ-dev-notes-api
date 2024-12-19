import { User } from "../models";
import { Async, AppError, JWT } from "../lib";

export const signIn = Async(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return next(new AppError(401, "please enter your email and password"));

  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new AppError(404, "incorrect email or password"));

  const isValidPassword = await user.checkPassword(password, user.password);

  if (!isValidPassword)
    return next(new AppError(404, "incorrect email or password"));

  const { accessToken } = JWT.assignToken({
    signature: {
      username: user.username,
      _id: user._id.toString(),
    },
    res,
  });

  res.status(201).json({ accessToken });
});

export const logout = Async(async (req, res, next) => {
  res.clearCookie("authorization");
  res.clearCookie("session");
  res.status(204).json("user is logged out");
});

export const refresh = Async(async (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) return next(new AppError(401, "you are not authorized"));

  const verifiedToken = await JWT.verifyToken(authorization, true);

  if (!verifiedToken)
    return next(new AppError(401, "User does not exists. Invalid credentials"));

  const user = await User.findById(verifiedToken._id);

  if (!user) return next(new AppError(404, "user does not exists"));

  const userData = {
    username: user.username,
    _id: user._id.toString(),
  };

  const { accessToken } = JWT.assignToken({ signature: userData, res });

  res.status(200).json({ accessToken });
});
