import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/sectors",
});

export const getSectors = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching sectors", error);
    throw error;
  }
};

export const createSector = async (sectorData) => {
  try {
    const response = await api.post("/", sectorData);
    return response.data;
  } catch (error) {
    console.error("Error creating sector", error);
    throw error;
  }
};
