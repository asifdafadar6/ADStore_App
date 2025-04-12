import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function SearchToAllProducts({ item, filters }) {
  const products = [
    {
      productId: 10,
      productName: 'Samsung TV',
      productImage: 'https://images-cdn.ubuy.co.in/655c82511611730e374d5b88-samsung-50-class-4k-crystal-uhd-2160p.jpg',
      productPrice: 20990,
      productDescription: 'It is the best TV in the world 4K',
    },
    {
      productId: 11,
      productName: 'Samsung Galaxy S6',
      productImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIRBTyHayEphRWf1cYHS_5_AG7clCjrz_qqA&s',
      productPrice: 20000,
      productDescription: 'It is the best Mobile in the world AMOLED',
    },
    {
      productId: 12,
      productName: 'Samsung Galaxy S7',
      productImage: 'https://m.media-amazon.com/images/I/71E-D-VQwNL.jpg',
      productPrice: 20700,
      productDescription: 'It is the best Mobile in the world Super AMOLED',
    }, {
      productId: 13,
      productName: 'Samsung Galaxy S7',
      productImage: 'https://m.media-amazon.com/images/I/71E-D-VQwNL.jpg',
      productPrice: 20100,
      productDescription: 'It is the best Mobile in the world Super AMOLED',
    }, {
      productId: 14,
      productName: 'Samsung Galaxy S7',
      productImage: 'https://m.media-amazon.com/images/I/71E-D-VQwNL.jpg',
      productPrice: 20200,
      productDescription: 'It is the best Mobile in the world Super AMOLED',
    },
  ];

  const searchTerm = item?.item?.toLowerCase() || '';

  // Filter by search term
  let filteredProducts = products.filter((product) => {
    const productName = product.productName.toLowerCase();
    return productName.includes(searchTerm);
  });

  // Apply filters
  if (filters === 'lowToHigh') {
    filteredProducts = filteredProducts.sort((a, b) => a.productPrice - b.productPrice);
  } else if (filters === 'highToLow') {
    filteredProducts = filteredProducts.sort((a, b) => b.productPrice - a.productPrice);
  }

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.productImage }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.productName}</Text>
        <Text style={styles.price}>₹{item.productPrice}</Text>
        <Text style={styles.description}>{item.productDescription}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Results</Text>
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.productId.toString()}
          renderItem={renderProduct}
        />
      ) : (
        <Text style={styles.noResult}>No products found.</Text>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: 'contain'
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
  },
  noResult: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 20,
  },
});
