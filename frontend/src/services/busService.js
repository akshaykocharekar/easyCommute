import axios from "../api/axios";

export const getPublicBuses = async () => {
  const response = await axios.get("/buses/public");
  return response.data;
};