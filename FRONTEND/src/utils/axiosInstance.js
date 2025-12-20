import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: `${import.meta.env.VITE_BACKEND_URI}`,
  withCredentials: true
});

export default axiosInstance;