import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { deleteCart, postCart } from "../provider/api/cart_api";
import { router } from "expo-router";
import { useMyContext } from "../provider/ContextApi";
import { Dimensions } from "react-native";

const { height } = Dimensions.get('window');

const ShoppingCartScreen = ({ params = {} }) => {
  const { fetchGetProduct, fetchGetCart, products } = useMyContext();
  const [cart, setCart] = useState(params?.cartItems || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [cartTotal, setCartTotal] = useState(0); //for testing purpose

  useEffect(() => {
    if (params?.cartItems) {
      setCart(params.cartItems);
    }
    console.log("Params Cart", params);

  }, [params?.cartItems]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchGetProduct();
        await fetchGetCart();
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError("Failed to load data.");
      }
    };
    fetchData();
  }, []);


  const calculatePayDetails = () => {
    // Check if cart and products are valid arrays
    if (!Array.isArray(cart)) {
      return { subtotal: 0, tax: 0, total: 0 };
    }

    let subtotal = 0;

    cart.forEach((item) => {
      // Find the product in the product list using item?._id
      const product = products.find((p) => p?._id === item?._id);
      console.log("Product found:", products);
      if (!product) return;

      let productTotal = 0;

      // If it's a group product
      if (product?.productType === "group" && Array.isArray(product.products)) {
        productTotal = product.products.reduce((sum, subProduct) => {
          const subProductPrice = parseFloat(subProduct?.salePriceAmount || subProduct?.regularPrice || 0);
          return sum + subProductPrice;
        }, 0);
      } else {
        // Normal product price calculation
        productTotal = parseFloat(product?.salePriceAmount || product?.regularPrice || 0);
      }

      // Ensure quantity is a valid number
      const quantity = parseInt(item?.quantity) || 1;
      subtotal += productTotal * quantity;

      console.log("Product Total:", productTotal);
      console.log("Quantity:", quantity);
      console.log("Subtotal so far:", subtotal);
    });

    // const tax = parseFloat((subtotal * 0.15).toFixed(2));
    // const total = parseFloat((subtotal + tax).toFixed(2));
    const total = parseFloat((subtotal).toFixed(2));

    console.log("Final Subtotal:", subtotal);
    console.log("Tax:", tax);
    console.log("Total:", total);

    return { subtotal, tax, total };
  };






  const [payDetails, setPayDetails] = useState({ subtotal: 0, tax: 0, total: 0 });


  useEffect(() => {
    setPayDetails(calculatePayDetails());
  }, [cart, products]);

  const { subtotal, tax, total } = payDetails;

  console.log("Subtotal:", subtotal);
  console.log("Tax:", tax);
  console.log("Total:", total);

  const DeleteCart = async (item) => {
    try {
      await deleteCart(item._id);
      await fetchGetProduct();
      await fetchGetCart();
    } catch (err) {
      console.error("Delete Error:", err.message);
      setError(err.message);
    }
  };

  const handleQuantityChange = async (id, change) => {
    if (!id) return;
    try {
      await postCart(id, change);
      await fetchGetProduct();
      await fetchGetCart();
    } catch (err) {
      console.error("Error updating cart:", err.message);
      setError(err.message);
    }
  };

  const handleIncrement = (id) => handleQuantityChange(id, 1);

  const handleDecrement = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityChange(id, -1);
    }
  };

  const handleProductDetails = (item) => {
    if (!item) return;
    router.push({
      pathname: "/productDetails",
      params: { ...item, attributes: JSON.stringify(item?.attributes || {}) },
    });
  };

  const handleSubmitCheckout = () => {
    if (cart.length > 0) {
      router.push(`/checkOut?products=${encodeURIComponent(JSON.stringify(cart))}`);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchGetProduct();
      await fetchGetCart();
    } catch (error) {
      console.error("Error refreshing products:", error.message);
      setError(error.message || "Error refreshing the list.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const renderCartItem = ({ item }) => {
    if (!item?._id) return null;
    console.log("Cart Product", item);
    const isGroupProduct = item?.productType === "group";
    const productName = item?.productName || "Unknown Product";
    const productImage = item?.singleImage || null;
    const productPrice = parseFloat(item?.salePriceAmount) || parseFloat(item?.regularPrice) || 0;
    const totalPrice = productPrice * (item?.quantity || 1);
    


    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => openModal(item)}>
          {productImage ? (
            <Image source={{ uri: productImage }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.details}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', position: 'absolute', zIndex: 20 }}
            onPress={() => DeleteCart(item)}>
            <MaterialIcons name="delete" size={28} color="gray" />
          </TouchableOpacity>

          <Text style={styles.productName}>
            {productName.length > 20 ? productName.substring(0, 20) + "..." : productName}
          </Text>

          <Text style={styles.productPrice}>Price: ₹{productPrice}</Text>
          <Text style={styles.quantity}>Quantity: {item?.quantity || 1}</Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => handleDecrement(item._id, item?.quantity)}
              style={styles.iconButton}
            >
              <AntDesign name="minus" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item?.quantity || 1}</Text>
            <TouchableOpacity
              onPress={() => handleIncrement(item._id)}
              style={styles.iconButton}>
              <AntDesign name="plus" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.totalPrice}>Total: ₹{totalPrice.toFixed(2)}</Text>
        </View>
      </View>
    );
  };


  // total amount 
  useEffect(() => {
    if (cart && cart.length > 0) {
      const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.salePriceAmount) || parseFloat(item.regularPrice) || 0;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
      }, 0);
      setCartTotal(total);
    }
  }, [cart]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>
      {error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : cart.length === 0 ? (
        <Text style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>No items in your cart.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => `${item?.product_id || index}`}
          renderItem={renderCartItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {cart.length > 0 && (
        <View style={styles.payCardContainer}>
          {/* <View style={styles.payRow}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={[styles.value, { color: "#000" }]}>₹{subtotal.toFixed(2)}</Text>
          </View> */}
          {/* <View style={styles.taxRow}>
            <Text style={styles.label}>Tax (15%)</Text>
            <Text style={[styles.value, { color: "#000" }]}>{`₹${tax.toFixed(2)}`}</Text>
          </View> */}
          <View style={styles.totalRow}>
            <Text style={styles.label}>Total</Text>
            <Text style={[styles.value, { color: "#000" }]}>₹{cartTotal.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleSubmitCheckout}>
            <LinearGradient colors={["#002B63", "#00B6F1"]} style={styles.checkoutGradientButton}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginVertical: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
  placeholder: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "green",
    marginTop: 4,
  },
  quantity: {
    fontSize: 14,
    marginTop: 4,
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    alignSelf: 'flex-start',
    marginTop: 10,
    zIndex: 10
  },

  quantityText: {
    fontSize: 16,
    marginHorizontal: 12,
    color: "#333",
  },


  // Pay
  payCardContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  payRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  taxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000", // Ensures visibility
  },

  checkoutButton: {
    width: "100%",
    borderRadius: 50,
    overflow: "hidden", // Ensures content fits inside
  },

  checkoutGradientButton: {
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  checkoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  // Modal
  itemButton: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  itemText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomDrawer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeText: {
    color: '#007bff',
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  itemDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

});

export default ShoppingCartScreen;
