import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  // Crucial for sending cookies cross-domain back to the server
  withCredentials: true,
});

export default api;
