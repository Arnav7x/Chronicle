import axios from "axios";

const api = axios.create({
  baseURL: "https://dochronicle.onrender.com/", // backend URL
  withCredentials: true,            
});

export default api;
