import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'https://ipawnode.apdux.tech/api';

export const postCart = async (id, quantity) => {
  try {
    const TOKEN = await AsyncStorage.getItem("userToken");
    const response = await axios.post(
      `${API_URL}/addtocart`,
      { productId: id, quantity },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting to cart:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to post cart data.");
  }
};

export const getCart = async () => {
  try {
    const TOKEN = await AsyncStorage.getItem("userToken");
    console.log("TOKEN Cart", TOKEN);

    const response = await axios.get(`${API_URL}/viewcart`, {
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

export const deleteCart = async (id) => {
  try {
    const TOKEN = await AsyncStorage.getItem("userToken");
    const response = await axios.delete(`${API_URL}/cart/item-remove/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting cart item:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.msg || "Failed to delete cart item.");
  }
};
