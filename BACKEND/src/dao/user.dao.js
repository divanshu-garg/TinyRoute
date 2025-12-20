import shortUrl from "../models/shorturl.model.js";
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

const deleteUrlFromUserDb = async (url_id, user_id)=>{
  return await shortUrl.findOneAndDelete({_id:url_id, user:user_id},);
}

export { findUserByEmail, findUserById, createUser, getAllUserUrlsFromDb, deleteUrlFromUserDb };