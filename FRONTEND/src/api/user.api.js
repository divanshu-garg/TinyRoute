import axiosInstance from "../utils/axiosInstance"

const loginUser = async(email, password ) =>{
    const {data} = await axiosInstance.post("/api/auth/login", {email,password});
    return data;
}


const registerUser = async(name, email, password) =>{
    const {data} = await axiosInstance.post("/api/auth/register", {name, email,password});
    return data;
}

const logoutUser = async ()=>{
    const {data} = await axiosInstance.post("/api/auth/logout")
    return data;
}

const getCurrentUser = async ()=>{
    const {data} = await axiosInstance.get("/api/auth/me")
    return data;
}

const getAllUserUrls = async () =>{
    const {data} = await axiosInstance.get("/api/user/urls")
    return data;
}

const deleteUserUrl = async (url_id, user_id) =>{
    const {data} = await axiosInstance.delete(`/api/user/urls/${url_id}`, {data:{user_id}})
    return data;
}

export {loginUser, registerUser, getCurrentUser, logoutUser, getAllUserUrls, deleteUserUrl };