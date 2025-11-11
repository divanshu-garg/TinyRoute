import axiosInstance from "../utils/axiosInstance"

const loginUser = async(email, password ) =>{
    const {data} = await axiosInstance.post("/api/auth/login", {email,password});
    return data;
}


const registerUser = async(name, email, password) =>{
    const {data} = await axiosInstance.post("/api/auth/register", {name, email,password});
    return data;
}

export {loginUser, registerUser };