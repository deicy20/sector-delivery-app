import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://sector-delivery-backend.onrender.com/api/sectors";

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Error al conectar con el servidor";
    console.error("Error en la petición:", errorMessage);
    return Promise.reject(errorMessage);
  }
);

export const getSectors = async () => {
  return api.get("/");
};

export const createSector = async (sectorData) => {
  return api.post("/", sectorData);
};

export const getAvailableSectors = async (coords) => {
  return api.get(`/available?lat=${coords.lat}&lng=${coords.lng}`);
};
