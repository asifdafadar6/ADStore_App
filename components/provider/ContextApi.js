import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProduct } from './api/product_api';
import { postWishlist, deleteWishlist, getWishlist } from './api/wishlist_api';
import { userLogin, userSignUp, verifyOtp } from './api/login_api'
import { getCart } from './api/cart_api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';
import { router } from 'expo-router';

const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishItem, setWishItem] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartItemLength, setCartItemLength] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

 
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await userLogin(email, password);
      
      if (!response?.token) {
        throw new Error("Login failed. No token received.");
      }

      await AsyncStorage.setItem("userData", JSON.stringify(response));
      await AsyncStorage.setItem("userToken", response.token);
      setUser(response);
      return true;
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const signup = async (userName, email, password) => {
    setIsLoading(true);
    try {
      const response = await userSignUp(userName, email, password);
      console.log("User Data:", response);
      if (response) {
        setUser(response);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error("Signup Error:", err.message);
      setError(err.message);
      // Alert.alert("Signup Error:", err.message)
    }
    setIsLoading(false);
    return false;
  };

  const verifyUserOtp = async (enteredOtp, email, userName, password) => {
    setIsLoading(true);
    try {
      const response = await verifyOtp(enteredOtp, email, userName, password);
      console.log("OTP Verification Response:", response);

      if (response) {
        await AsyncStorage.setItem("userData", JSON.stringify(response.user));
        setUser(response.user);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error("OTP Verification Error:", err.message);
      setError(err.message);
    }
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.multiRemove(["userData", "userToken"]);
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

// Fetch wishlist
const fetchGetWishList = async () => {
  try {
    const response = await getWishlist();
    console.log('Wishlist fetched successfully:', response.formattedProducts);
    setWishItem(response.formattedProducts);
    return response;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Add to wishlist
const sendPostWishlist = async (productId) => {
  console.log('Adding to wishlist:', productId);
  try {
    const response = await postWishlist(productId);
    console.log('Added to wishlist successfully:', response);
    return response; // Make sure this returns the full added item
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove from wishlist
const deleteWishlistItem = async (productId) => {
  try {
    const response = await deleteWishlist(productId);
    console.log('Removed from wishlist successfully:', response);
    return response;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

  // Toggle wishlist item
  const toggleWishlist = async (productId) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Check if item exists in wishlist (using _id)
      const isInWishlist = wishItem.some(item => item._id === productId);
      
      if (isInWishlist) {
        await deleteWishlistItem(productId);
        setWishItem(prev => prev.filter(item => item._id !== productId));
        console.log('Removed from wishlist:', productId);
      } else {
        const addedItem = await sendPostWishlist(productId);
        // Make sure to use the correct property name (_id)
        setWishItem(prev => [...prev, { _id: productId, ...addedItem }]);
        console.log('Added to wishlist:', productId);
      }
    } catch (error) {
         // Improved error logging
         console.error('Full error object:', error);
        
         // Get the message from different possible locations
         const errorMessage = error.response?.data?.msg 
                           || error.response?.data?.message
                           || error.message
                           || 'Failed to update wishlist';
         
                           if(errorMessage === "Failed to post cart data.")
                           {
                            Alert.alert("Notice", "Product Already Exits in Wishlist" );
                           }
                           else
                           {
                            Alert.alert("Error", errorMessage);
                           }
      // console.error('Error toggling wishlist:', error);
      // Alert.alert("Error", error.response?.data?.msg || "Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  };
  
  


  // Fetch product data
  const fetchGetProduct = async () => {
    try {
      const response = await getProduct();
      const fetchedProducts = Array.isArray(response.msg) ? response.msg : [];
      setProducts(fetchedProducts || []);
      // console.log('Data:', fetchedProducts);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err.message);
    }
  };

  const fetchGetCart = async () => {
    try {
      const response = await getCart();
      setCartItems(response.products);
      setCartItemLength(response.products.length);
      // console.log("Number of cart:", response.products);
    } catch (err) {
      console.error("Error fetching cart items:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGetProduct();
  }, []);

  // useEffect(() => {
  //   fetchGetCart();
  // }, []);


  const contextValue = {
    user, login, signup, logout, verifyUserOtp,
    wishItem,
    setWishItem,
    fetchGetWishList,
    toggleWishlist,
    cartItemLength,
    setCartItemLength,
    cartItems,
    setCartItems,
    fetchGetProduct,
    fetchGetCart,
    products,
    setProducts,
    isLoading,
    error,

  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
