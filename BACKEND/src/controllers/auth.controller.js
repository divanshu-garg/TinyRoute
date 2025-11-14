import { cookieOptions } from "../config/config.js";
import { createUser, findUserByEmail } from "../dao/user.dao.js";
import { BadRequestError, ConflictError } from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";
import { asyncHandler } from "../utils/tryCatchWrapper.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await findUserByEmail(email);
  if (user) throw new ConflictError("User already exists");
  const newUser = await createUser(name, email, password);
  const token = await signToken({ id: newUser._id });
  req.user = newUser;
  res.cookie("accessToken", token, cookieOptions);
  res.status(200).json({ message: "account created successfully" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user || user.password !== password)
    throw new BadRequestError("Invalid email or password");
  const token = await signToken({ id: user._id });
  req.user = user
  res.cookie("accessToken", token, cookieOptions);
  const userObj = {
    name:user.name,
    email: user.email,
    _id:user._id
  };
  res.status(200).json({ user:userObj, message: "login successful" });
});

const getCurrentUser = asyncHandler((req, res) => {
    res.status(200).json({ user: req.user });
});

export { registerUser, loginUser, getCurrentUser };