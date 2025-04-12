import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'https://ipawnode.apdux.tech/api';


export const postOrder = async (data) => {
  try {
    const sanitizedData = JSON.parse(JSON.stringify(data, (key, value) =>
      Array.isArray(value) ? [...value] : value 
    ));

    console.log("Send DATA", sanitizedData);

    const TOKEN = await AsyncStorage.getItem("userToken");
    if (!TOKEN) {
      throw new Error("User token not found.");
    }

    console.log("TOKEN", TOKEN);

    const response = await axios.post(`${API_URL}/placeorder`, sanitizedData, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error posting order:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to post order data.");
  }
};


export const getOrder = async () => {
  try {
    const TOKEN = await AsyncStorage.getItem("userToken");
    const userData = await AsyncStorage.getItem("userData"); 

    if (!TOKEN) throw new Error("User token not found.");
    if (!userData) throw new Error("User data not found.");

    const parsedUser = JSON.parse(userData); 
    const userId = parsedUser?.payload?.id;

    console.log("UserID",userData);
    

    if (!userId) throw new Error("User ID not found in userData.");

    console.log("Fetching order for user:", userId);

    const response = await axios.get(`${API_URL}/orderById/${userId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to fetch order data.");
  }
};
