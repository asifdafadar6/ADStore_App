import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Modal
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { getOrder } from '../provider/api/order_api';

const { width } = Dimensions.get('window');

export default function Orders() {
  const [activeTab, setActiveTab] = useState('Active');
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchOrder = async () => {
    try {
      const response = await getOrder();
      console.log("Get Order:", response);
      setOrders(response?.msg || []);
    } catch (error) {
      console.error("Error fetching order:", error);
      setOrders([]); // Reset orders in case of error
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  // Filter orders based on the active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Active') {
      return order.orderStatus !== 'Delivered';
    } else {
      return order.orderStatus === 'Delivered';
    }
  });

  return (
    <View style={styles.container}>
      {/* Tab Container */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Active' ? styles.activeTab : null]}
          onPress={() => setActiveTab('Active')}
        >
          <MaterialIcons name="pending-actions" size={20} color={activeTab === 'Active' ? '#002B63' : '#aaa'} />
          <Text style={[styles.tabText, activeTab === 'Active' ? styles.activeText : null]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Previous' ? styles.activeTab : null]}
          onPress={() => setActiveTab('Previous')}
        >
          <FontAwesome5 name="history" size={18} color={activeTab === 'Previous' ? '#002B63' : '#aaa'} />
          <Text style={[styles.tabText, activeTab === 'Previous' ? styles.activeText : null]}>Previous</Text>
        </TouchableOpacity>
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders.flatMap(order =>
          order.items.map(product => ({
            ...product,
            orderId: order._id,
            totalPrice: order.totalPrice,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            orderDate: order.orderDate,
            orderTime: order.orderTime,
            shippingDetails: order.shippingDetails
          }))
        )}
        keyExtractor={(item) => `${item.orderId}-${item._id}`} // Unique key for each item
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productDetails}>Type: {item.productType}</Text>
            <Text style={styles.productDetails}>Regular Price: ₹{item.regularPrice}</Text>
            <Text style={styles.productDetails}>Sale Price: ₹{item.salePriceAmount}</Text>
            <Text style={styles.productDetails}>Order Status: {item.orderStatus}</Text>
            <Text style={styles.productDetails}>Payment: {item.paymentStatus}</Text>
            <Text style={styles.productDetails}>Order Date: {item.orderDate} {item.orderTime}</Text>

            {/* Track Button */}
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => {
                setSelectedProduct(item);
                setModalVisible(true);
              }}
            >
              <Text style={styles.trackButtonText}>Track</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} orders found.</Text>
          </View>
        }
      />

      {/* Track Order Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tracking Details</Text>
            {selectedProduct && (
              <>
                <Text style={styles.modalText}>Order ID: {selectedProduct.orderId}</Text>
                <Text style={styles.modalText}>Product: {selectedProduct.productName}</Text>
                <Text style={styles.modalText}>Status: {selectedProduct.orderStatus}</Text>
                <Text style={styles.modalText}>Estimated Delivery: 2-3 Business Days</Text>
                <Text style={styles.modalText}>Shipping To: {selectedProduct.shippingDetails.firstName} {selectedProduct.shippingDetails.lastName}</Text>
                <Text style={styles.modalText}>Address: {selectedProduct.shippingDetails.city}, {selectedProduct.shippingDetails.state}, {selectedProduct.shippingDetails.zip}</Text>
              </>
            )}
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingBottom: 30, paddingHorizontal: 20 },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#002B63' },
  tabText: { fontSize: 14, color: '#aaa', marginTop: 5 },
  activeText: { color: '#002B63', fontWeight: 'bold' },
  productCard: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 10, elevation: 5 },
  productName: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  productDetails: { fontSize: 14, color: '#555', marginTop: 2 },
  trackButton: { backgroundColor: '#002B63', padding: 10, marginTop: 10, borderRadius: 5, alignItems: 'center' },
  trackButtonText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 14, marginBottom: 5 },
  modalCloseButton: { marginTop: 10, backgroundColor: '#EB6A39', padding: 10, borderRadius: 5, alignItems: 'center' },
  modalCloseText: { color: '#fff', fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#555' },
});