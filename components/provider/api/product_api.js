import axios from "axios";

const API_URL = 'https://ipawnode.apdux.tech/api';


export async function getProduct() {
  try {
    const response = await axios.get(`${API_URL}/masterProduct/fetchAllProduct`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Product:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to fetch product.");
  }
}


