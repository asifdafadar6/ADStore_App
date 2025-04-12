import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useMyContext } from '../provider/ContextApi';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getProduct } from '../provider/api/product_api';
import { postCart } from '../provider/api/cart_api';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Wishlist() {
  const { wishItem, fetchGetWishList, toggleWishlist, isLoading, fetchGetCart } = useMyContext();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch wishlist on initial render
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setRefreshing(true);
        await fetchGetWishList();
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setRefreshing(false);
      }
    };
    loadWishlist();
  }, []);


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


  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchGetWishList();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchGetWishList]);

  const handleDetails = (item) => {
    router.push({
      pathname: '/productDetails',
      params: {
        ...item,
        attributes: JSON.stringify(item.attributes),
      },
    });
  };

  const renderItem = ({ item }) => (
    <View key={item._id}>
      <TouchableOpacity
        style={styles.itemsCard}
        onPress={() => handleDetails(item)}
        activeOpacity={1}
      >
        <View style={styles.heartContainer}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // Prevent triggering the parent onPress
              toggleWishlist(item._id);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#051937" />
            ) : (
              <AntDesign
                name={wishItem.some(wish => wish._id === item._id) ? 'heart' : 'hearto'}
                size={20}
                color={wishItem.some(wish => wish._id === item._id) ? 'red' : '#051937'}
              />
            )}
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: item.singleImage }}
          style={styles.itemsImage}
          resizeMode="contain"
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.itemsName} numberOfLines={1}>{item.productName}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{'4.8'}</Text>
            <AntDesign name="star" size={16} color="gold" />
          </View>
        </View>

        <Text style={styles.itemsPrice}>₹{item.salePriceAmount}</Text>
        <TouchableOpacity style={styles.plusIcon} onPress={() => { handleAddToCart(item._id, item.minimumQty) }}>
          <AntDesign name="pluscircle" size={24} color="#051937" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  if (refreshing && wishItem.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#051937" />
      </View>
    );
  }

  if (!wishItem || wishItem.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="heart-o" size={50} color="#EB6A39" style={styles.emptyIcon} />
        <Text style={styles.emptyMessage}>Your wishlist is empty!</Text>
        <Text style={styles.emptySubMessage}>Add items to your wishlist to see them here.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wish List</Text>

      <FlatList
        data={wishItem}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.scrollContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}


const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4 + 10;
const CARD_HEIGHT = CARD_WIDTH * 1.5;


const styles = StyleSheet.create({
  container: {
    file: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    paddingBottom: 200
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#051937',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 4,
  },
  itemsImage: {
    width: '100%',
    height: CARD_HEIGHT * 0.6,
    borderRadius: 8,
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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    height: '100%'
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

