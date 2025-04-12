import React, { useEffect, useState } from "react";
import MyCart from "../../components/pages/MyCart";
import { getCart } from "../../components/provider/api/cart_api";
import { Text } from "react-native";
import { useMyContext } from "../../components/provider/ContextApi";

export default function MyCartScreen() {
    const { fetchGetCart, cartItems } = useMyContext();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGetCart()
            .then(() => setLoading(false))
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Text>Loading cart...</Text>;
    }

    if (error) {
        return <Text>Error fetching cart items: {error}</Text>;
    }

    return <MyCart params={{ cartItems: cartItems || [] }} />;
}
