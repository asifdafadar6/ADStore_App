import { View, Text } from 'react-native';
import React from 'react';
import CheckOut from '../../components/pages/CheckOut';
import { useGlobalSearchParams } from 'expo-router';

export default function Checkout() {
  const params = useGlobalSearchParams();
  const products = params.products ? JSON.parse(decodeURIComponent(params.products)) : [];

  console.log("Checkout Data", products);

  return <CheckOut params={products} />;
}
