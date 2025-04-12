import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useMyContext } from '../provider/ContextApi';
import { router } from 'expo-router';
import { getProduct } from '../provider/api/product_api';
import { postCart } from '../provider/api/cart_api';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MostSellItems() {
  const { wishItem, fetchGetWishList, toggleWishlist, isLoading, fetchGetCart } = useMyContext();
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);


  const fetchGetProduct = async () => {
    try {
      const response = await getProduct();
      // console.log("API Response:", response);
      const products = Array.isArray(response.msg) ? response.msg : [];
      setProduct(products);
      console.log("Processed Products:", products);
    } catch (err) {
      console.error("Error fetching product:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGetCart();
  }, [product]);

  const handleAddToCart = async (index, quantity) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Login Required", "Please log in to add items to your cart.");
        return;
      }

      const response = await postCart(index, quantity); // Using index instead of id
      if (response) {
        fetchGetCart();
        console.log("Cart response:", response);
      }
    } catch (err) {
      console.error("Error adding to cart:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGetProduct();
    fetchGetWishList();
  }, []);

  const handleDetails = (item, index) => {
    if (!item) {
      console.error("Invalid product data", item);
      return;
    }

    router.push({
      pathname: '/productDetails',
      params: {
        ...item,
        attributes: JSON.stringify(item.attributes || {}),
        index: index.toString(), // Use index instead of id
      },
    });
  };

  const renderFishItem = ({ item, index }) => {
    if (!item) return null; // Ensure item is valid

    return (
      <View key={index}>
        <TouchableOpacity style={styles.itemsCard} onPress={() => handleDetails(item, index)} activeOpacity={1}>
          <View style={styles.heartContainer}>

            <TouchableOpacity
              onPress={() => toggleWishlist(item._id)}
              disabled={isLoading}
              style={styles.wishlistButton}
            >
              <AntDesign
                name={wishItem?.some(wish => wish._id === item._id) ? 'heart' : 'hearto'}
                size={20}
                color={wishItem?.some(wish => wish._id === item._id) ? 'red' : '#051937'}
              />
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#051937"
                  style={styles.loadingIndicator}
                />
              )}
            </TouchableOpacity>

          </View>

          {item.singleImage ? (
            <Image source={{ uri: item.singleImage }} style={styles.itemsImage} resizeMode="contain" />
          ) : (
            <Text style={styles.noImageText}>No Image</Text>
          )}

          <View style={styles.detailsContainer}>
            <Text style={styles.itemsName} numberOfLines={1}>
              {item.productName?.length > 10 ? `${item.productName.slice(0, 10)}...` : item.productName}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>4.8</Text>
              <AntDesign name="star" size={20} color="gold" />
            </View>
          </View>

          <Text style={styles.itemsPrice}>₹{item.salePrice || item.regularPrice}</Text>
          <TouchableOpacity style={styles.plusIcon}  onPress={() => { handleAddToCart(item._id, item.minimumQty) }}>
            <AntDesign name="pluscircle" size={24} color="#051937" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Most Selling Products</Text>
        <TouchableOpacity onPress={() => setVisibleCount(visibleCount === 4 ? product.length : 4)}>
          <Text style={styles.seeAllText}>{visibleCount === 4 ? "See All" : "Show Less"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        // data={product || []} // Ensures data is always an array
        data={(product || []).slice(0, visibleCount)}
        renderItem={renderFishItem}
        keyExtractor={(_, index) => index.toString()} // Use index instead of id
        // horizontal
        // showsHorizontalScrollIndicator={false}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.fishList}
      />
    </View>
  );
}


const { width } = Dimensions.get('window');
// const CARD_WIDTH = width * 0.4 + 10;
const CARD_WIDTH = (width - 48) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 12
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#002B63',
    fontWeight: '500',
  },
  fishList: {
    paddingHorizontal: 4,
  },
  itemsCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 4,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    position: 'relative',
  },
  heartContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  heartIcon: {
    zIndex: 10,
  },
  itemsImage: {
    width: '100%',
    height: CARD_HEIGHT * 0.6,
    borderRadius: 8,
    marginBottom: 12,
  },
  noImageText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemsName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#051937',
    flex: 1,
    marginRight: 4,
  },
  itemsPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002B63',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    marginRight: 4,
    color: '#333333',
  },
  plusIcon: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  loadingIndicator: {
    display: "none"
  }
});
