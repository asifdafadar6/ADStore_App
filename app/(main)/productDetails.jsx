import { View, Text } from 'react-native';
import React from 'react';
import ProductDetails from '../../components/pages/ProductDetails';
import { useGlobalSearchParams } from 'expo-router';

export default function ProductDetailsScreen() {
    const params = useGlobalSearchParams();
    console.log("Received params ProductDetails:", params);
    
    return (
        <View>
            <ProductDetails params={params} />
        </View>
    );
}
