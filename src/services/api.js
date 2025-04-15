import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://sector-delivery-backend.onrender.com/api/sectors";

const api = axios.create({
  baseURL,
  timeout: 8000,
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

    console.error(`Error en ${error.config.url}:`, errorMessage);

    if (error.response?.status === 401) {
      console.warn("No autorizado - Redirigir a login");
    }

    throw new Error(errorMessage);
  }
);

export const getSectors = async () => {
  return api.get("/");
};

export const createSector = async (sectorData) => {
  return api.post("/", sectorData);
};

export const getAvailableSectors = async ({ lat, lng }) => {
  return api.get(`/available?lat=${lat}&lng=${lng}`);
};
