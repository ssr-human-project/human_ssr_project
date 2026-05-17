import api from "./axios";

export const getRegions = () => {
  return api.get("/regions");
};