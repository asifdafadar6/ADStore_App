import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const notifications = [
  {
    id: '1',
    icon: 'shopping-cart',
    title: 'Order Confirmation',
    message: 'Your order #12345 has been confirmed!',
    time: '2h ago',
  },
  {
    id: '2',
    icon: 'gift',
    title: 'Special Offer',
    message: 'Get 20% off your next purchase. Limited time only!',
    time: '1d ago',
  },
  {
    id: '3',
    icon: 'check-circle',
    title: 'Delivery Complete',
    message: 'Your order #12345 has been delivered.',
    time: '3d ago',
  },
];

export default function Notification() {
  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <FontAwesome5 name={item.icon} size={24} color="#EB6A39" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: '#aaa',
  },
});
