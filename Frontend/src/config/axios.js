import axios from "axios";
import API_BASE from "./api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

export default axiosInstance;