import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const offers = [
  { id: '1', title: '50% Off on Shoes', description: 'Get half price on selected shoe brands.', image: 'https://www.hindustantimes.com/ht-img/img/2024/11/27/550x309/myntra_black_friday_sale_on_shoes_1732707623801_1732707734586.jpg' },
  { id: '2', title: 'Buy 1 Get 1 Free', description: 'Applicable on all t-shirts.', image: 'https://www.photoland.in/wp-content/uploads/2022/05/tshirt-offer-banner-mobile-584x290.jpg' },
  { id: '3', title: 'Summer Sale', description: 'Applicable on all t-shirts.', image: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/summer-shirt-sale-design-template-b164a53c01a4bb3b26e5584134d37253_screen.jpg?ts=1687258668' },
];

export default function OffersPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Special Offers</Text>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.offerCard}>
            <Image source={{ uri: item.image }} style={styles.offerImage} />
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text style={styles.offerDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  offerCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  offerImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
