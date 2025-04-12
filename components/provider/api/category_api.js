import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'https://ipawnode.apdux.tech/api';


export const getCategory = async () => {
    try {
      const TOKEN = await AsyncStorage.getItem("userToken");
        const response = await axios.get(`${API_URL}/category`, {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          });      
        return response.data;
    } catch (error) {
        console.error("Error fetching cart data:", error?.response?.data || error.message);
        throw new Error(error?.response?.data?.message || "Failed to fetch cart data.");
    }
}