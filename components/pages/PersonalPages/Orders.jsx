import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const orders = [
    {
        id: "1",
        product: "Samsung Galaxy S23",
        status: "Delivered on Jan 25, 2025",
        image:
            "https://images.samsung.com/is/image/samsung/p6pim/in/sm-s711blgbins/gallery/in-galaxy-s23-fe-s711-479553-sm-s711blgbins-538355944?$684_547_PNG$",
        tracking: [
            { step: "Order Placed", date: "Jan 20, 2025" },
            { step: "Order Packed", date: "Jan 21, 2025" },
            { step: "Shipped", date: "Jan 22, 2025" },
            { step: "Delivered", date: "Jan 25, 2025" },
        ],
    },
    {
        id: "2",
        product: "Apple MacBook Air M2",
        status: "Arriving on Feb 15, 2025",
        image:
            "https://inventstore.in/wp-content/uploads/2023/04/macbook-air-m2-silver-600x600-1.webp",
        tracking: [
            { step: "Order Placed", date: "Feb 10, 2025" },
            { step: "Order Packed", date: "Feb 11, 2025" },
            { step: "Shipped", date: "Feb 12, 2025" },
        ],
    },
];

export default function OrdersPage() {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    const openModal = (order) => {
        setCurrentOrder(order);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setCurrentOrder(null);
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.details}>
                <Text style={styles.productName}>{item.product}</Text>
                <Text style={styles.status}>{item.status}</Text>
                <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => openModal(item)}
                >
                    <MaterialIcons name="local-shipping" size={20} color="white" />
                    <Text style={styles.trackButtonText}>Track Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Orders</Text>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrderItem}
                showsVerticalScrollIndicator={false}
            />

            {/* Modal for Tracking */}
            {currentOrder && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeader}>Tracking Details</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={{ uri: currentOrder.image }}
                                    style={{ height: 120, width: 100, marginRight: 10 }}
                                />
                                <Text
                                    style={[styles.modalHeader, { flex: 1, flexWrap: 'wrap', textAlign: 'left' }]}
                                    numberOfLines={2} >
                                    {currentOrder.product}
                                </Text>
                            </View>

                            <ScrollView>
                                {currentOrder.tracking.map((step, index) => (
                                    <View key={index} style={styles.trackingStep}>
                                        <MaterialIcons
                                            name="check-circle"
                                            size={24}
                                            color="#002B63"
                                        />
                                        <View style={styles.trackingDetails}>
                                            <Text style={styles.stepText}>{step.step}</Text>
                                            <Text style={styles.dateText}>{step.date}</Text>
                                        </View>
                                    </View>
                                ))}

                                {/* Add a "Pending" step for Delivery if not yet delivered */}
                                {!currentOrder.tracking.some((step) => step.step === "Delivered") && (
                                    <View style={styles.trackingStep}>
                                        <MaterialIcons
                                            name="check-circle"
                                            size={24}
                                            color="gray" // Gray for pending delivery
                                        />
                                        <View style={styles.trackingDetails}>
                                            <Text style={styles.stepText}>Delivered</Text>
                                            <Text style={styles.dateText}>Pending</Text>
                                        </View>
                                    </View>
                                )}
                            </ScrollView>


                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeModal}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#F5F5F5",
        // padding: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    details: {
        flex: 1,
        justifyContent: "center",
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    status: {
        fontSize: 14,
        color: "gray",
        marginVertical: 5,
    },
    trackButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#002B63",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: 'flex-start'
    },
    trackButtonText: {
        color: "white",
        marginLeft: 5,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    trackingStep: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    trackingDetails: {
        marginLeft: 10,
    },
    stepText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    dateText: {
        fontSize: 14,
        color: "gray",
    },
    closeButton: {
        backgroundColor: "#002B63",
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: "center",
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});
