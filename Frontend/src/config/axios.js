import axios from "axios";
import API_BASE from "./api";

const axios1 = axios.create({
  baseURL: API_BASE,
});

export default axios1;