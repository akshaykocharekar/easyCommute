import axios from "../api/axios";

export const registerUser = async (data) => {
  const response = await axios.post("/auth/register", data);
  return response.data;
};

export const registerOperator = async (data) => {
  const response = await axios.post("/auth/register-operator", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axios.post("/auth/login", data);
  return response.data;
};