import axios from "axios";

const baseURL = "https://sector-delivery-backend.onrender.com/api/sectors";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("Error en la API:", error.message);
    throw error;
  }
);

export const getSectors = () => api.get("/");
export const createSector = (sectorData) => api.post("/", sectorData);
