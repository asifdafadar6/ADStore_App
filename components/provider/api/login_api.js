import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://ipawnode.apdux.tech/api";

export const userLogin = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error?.response?.data || error.message);
        throw new Error(error?.response?.data?.message || "Failed to log in.");
    }
};

export const userSignUp = async (userName, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/insertuser`, { userName, email, password });
        return response.data;
    } catch (error) {
        console.error("Error signing up:", error?.response?.data || error.message);
        throw new Error(error?.response?.data?.message || "Failed to sign up.");
    }
};
export const verifyOtp = async (enteredOtp,email, userName, password) => {
    console.log("PAyload Data",enteredOtp,email, userName, password);
    
    try {
        const response = await axios.post(`${API_URL}/verify-otp`, {otp:enteredOtp,email, userName, password});
        return response.data;
    } catch (error) {
        console.error("Error enteredOtp up:", error?.response?.data || error.message);
        throw new Error(error?.response?.data?.message || "Failed to sign up.");
    }
};
