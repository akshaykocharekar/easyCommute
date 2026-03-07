import axios from "../api/axios";

export const getRoutes = async () => {
  const response = await axios.get("/routes");
  return response.data;
};

export const getRouteById = async (routeId) => {
  const res = await axios.get(`/routes/${routeId}`);
  return res.data;
};