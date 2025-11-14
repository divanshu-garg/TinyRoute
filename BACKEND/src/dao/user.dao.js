import shortUrl from "../models/shortUrl.model.js";
import User from "../models/user.model.js"

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (name, email, password) => {
  const newUser = new User({name,email,password});
  await newUser.save();
  return newUser;
};

const getAllUserUrlsFromDb = async (_id)=>{
  return await shortUrl.find({user:_id})
}

export { findUserByEmail, findUserById, createUser, getAllUserUrlsFromDb };