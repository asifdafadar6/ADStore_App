import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getCategory } from '../provider/api/category_api';

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategory();
        if (response && response.all_data) {
          setCategories(response.all_data);
          setSelectedCategory(response.all_data[0]?._id); // Select the first category by default
        }
      } catch (error) {
        console.error("Fetch Error", error);
      }
    };

    fetchCategories();
  }, []);

  const gotoDetails = (item) => {
    router.push({
      pathname: '/productDetails',
      params: {
        ...item,
        attributes: JSON.stringify(item.attributes),
      },
    });
  };

  const renderCategoryItem = ({ item }) => {
    const categoryImage = item.categoryImage ? item.categoryImage.replace(/,₹/, '') : null;
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selectedCategory === item._id && styles.activeCategoryButton,
        ]}
        onPress={() => setSelectedCategory(item._id)}>
        <View style={{ alignItems: 'center' }}>
          {categoryImage ? (
            <Image source={{ uri: categoryImage }} style={styles.categoryImage} />
          ) : (
            null
          )}
          <Text style={styles.categoryButtonText}>
            {item.categoryName.length > 10 ? item.categoryName.slice(0, 6) + "..." : item.categoryName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => gotoDetails(item)}>
        <Image source={{ uri: item.singleImage }} style={styles.productImage} />
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {item.productName.length > 10 ? item.productName.slice(0, 10) + "..." : item.productName}
        </Text>

        <Text style={styles.productPrice}>₹{item.salePrice}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="gold" />
          <Text style={styles.ratingText}>{"4.8"}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const getProductsForSelectedCategory = () => {
    const category = categories.find(cat => cat._id === selectedCategory);
    return category?.products || [];
  };

  return (
    <View style={styles.container}>
      {/* Category List */}
      <View style={styles.categoryListWrapper}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Product List */}
      <FlatList
        data={getProductsForSelectedCategory()}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  categoryListWrapper: {
    paddingVertical: 10,
  },
  categoryList: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#f4f4f6',
    borderRadius: 5,
  },
  activeCategoryButton: {
    borderBottomWidth: 4,
    borderBottomColor: '#002B63',
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    resizeMode: 'contain',
  },
  categoryButtonText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  productList: {
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    margin: 5,
    width: '45%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    marginTop: 20,
  },
  productImage: {
    width: 140,
    height: 140,
    marginBottom: 10,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
});
