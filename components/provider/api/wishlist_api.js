import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'https://ipawnode.apdux.tech/api';

export const postWishlist = async (id) => {
    try {
        const TOKEN = await AsyncStorage.getItem("userToken");
        const response = await axios.post(
            `${API_URL}/addwishlist`,
            {productId:id },
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

export const getWishlist = async () => {
    try {
        const TOKEN = await AsyncStorage.getItem("userToken");
        const response = await axios.get(`${API_URL}/viewwishlist`, {
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

export const deleteWishlist = async (id) => {
    try {
        const TOKEN = await AsyncStorage.getItem("userToken");
        const response = await axios.delete(`${API_URL}/deletewishlist/${id}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting wishlist item:", error?.response?.data || error.message);
        throw new Error(error?.response?.data?.message || "Failed to delete wishlist item.");
    }
}


