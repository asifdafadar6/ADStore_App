import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Linking, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { getProduct } from '../provider/api/product_api';
import { postOrder } from '../provider/api/order_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteCart } from '../provider/api/cart_api';


export default function CheckOut({ params }) {
  const cart = params || [];
  // console.log("Cart DATA", cart);

  const [products, setProducts] = useState([]);
  // console.log("Cart products", products);

  const [error, setError] = useState("");

  // Fetch products from the API
  const fetchGetProduct = async () => {
    try {
      const response = await getProduct();
      const fetchedProducts = Array.isArray(response.msg) ? response.msg : [];
      setProducts(fetchedProducts || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGetProduct();
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

      // console.log("Product found:", products);  me

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

    const tax = parseFloat((subtotal * 0.15).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

    // console.log("Final Subtotal:", subtotal); me
    // console.log("Tax:", tax); me
    console.log("Total:", total);

    return { subtotal, tax, total };
  };

  const [payDetails, setPayDetails] = useState({ subtotal: 0, tax: 0, total: 0 });

  useEffect(() => {
    setPayDetails(calculatePayDetails());
  }, [cart, products]);

  const { subtotal, tax, total } = payDetails;

  const handleIncrement = async (id, quantity) => {
    try {
      const response = await postCart(id, quantity);
      console.log("Cart response:", response);
    } catch (err) {
      console.error("Error fetching product:", err.message);
      setError(err.message);
    }
  };

  const handleDecrement = async (id, quantity) => {
    try {
      await postCart(id, quantity);
    } catch (err) {
      console.error("Error fetching product:", err.message);
      setError(err.message);
    }
  };

  // Shipping Address
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);
  const [isCompanyExpanded, setIsCompanyExpanded] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [cartTotal, setCartTotal] = useState(0);


  const shippingLocation = [
    {
      id: "1",
      firstName: "Robiul",
      lastName: "Islam",
      city: "Suri 2",
      state: "W.B",
      zip: "731101",
      phone: "+91 9876541235",
      additionalInformation: null,
      apartment: null,
    },
    {
      id: "2",
      firstName: userInfo?.payload?.firstName || "Robiul",
      lastName: userInfo?.payload?.lastName || "Istam",
      city: userInfo?.payload?.city,
      state: userInfo?.payload?.state,
      zip: "731101",
      phone: userInfo?.phone,
      additionalInformation: null,
      apartment: null,
    },
    {
      id: "3",
      firstName: userInfo?.payload?.firstName || "Robiul",
      lastName: userInfo?.payload?.lastName || "Istam",
      city: userInfo?.payload?.city,
      state: userInfo?.payload?.state,
      zip: "731101",
      phone: userInfo?.phone,
      additionalInformation: null,
      apartment: null,
    }


  ];

  // Payment Method
  
  const [selectedMethod, setSelectedMethod] = useState(null);

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      console.log("AsyncData", userData ? JSON.parse(userData) : null);
      setUserInfo(userData ? JSON.parse(userData) : null)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => { fetchUserData() }, [])

  console.log("userInfo", userInfo?.payload?.id);

  const getOrder = async () => {
    try {
      if (!selectedMethod) {
        Alert.alert("Alert", "Please select a payment method");
        return;
      }

      if (!cart || cart.length === 0) {
        Alert.alert("Alert", "Your cart is empty");
        return;
      }

      const selectedAddressDetails = shippingLocation.find(addr => addr.id === selectedAddress);

      if (!selectedAddressDetails) {
        Alert.alert("Alert", "Please select a valid shipping address");
        return;
      }

      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

      // Format time as HH:MM:SS (local time)
      const formattedTime = currentDate.toLocaleTimeString("en-IN", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const formattedItems = cart.map(item => ({
        _id: item._id,
        productType: item.productType,
        productName: item.productName,
        regularPrice: item.regularPrice,
        salePriceAmount: item.salePriceAmount
      }));

      const data = {
        shippingDetails: { ...selectedAddressDetails, id: undefined },
        paymentMode: selectedMethod,
        items: JSON.stringify(formattedItems),
        orderDate: formattedDate,
        orderTime: formattedTime,
        paymentStatus: selectedMethod === "Cash" ? "Due" : "Paid",
        shippingMethod: "Free Shipping",
        totalPrice: Number(total) || 0,
        userId: userInfo?.payload?.id || "",
      };

      console.log("Sending Order Data:", data);

      const response = await postOrder(data);
      console.log("Order Response:", response);

      if (response) {
        Alert.alert("Success", "Congratulation, Your Order is Successfully Placed");
        // router.replace("(drawer)");
      }
    } catch (error) {
      console.error("Order Error:", error?.response?.data || error.message);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const DeleteCart = async (item) => {
    try {
      await deleteCart(item._id);
      await fetchGetProduct();
      console.log("Press Delete Button")
    } catch (err) {
      console.error("Delete Error:", err.message);
      setError(err.message);
    }
  };

  const handleProductDetails = (item) => {
    router.push({
      pathname: '/productDetails',
      params: {
        ...item,
        attributes: JSON.stringify(item.attributes),
      },
    });
  }

  const [showAll, setShowAll] = useState(false);

  const renderCartItem = ({ item }) => {
    // console.log("Received item in renderCartItem:", item); me

    if (!item || typeof item !== "object") {
      console.error("Invalid item received:", item);
      return null;
    }

    if (!item._id) {
      console.error("Item has no _id:", item);
      return null;
    }

    const isGroupProduct = item.productType === "group";

    // Get product details safely
    const productName = item.productName || "Unknown Product";
    const productImage = item.singleImage || null;
    const productPrice = parseFloat(item.salePriceAmount) || parseFloat(item.regularPrice) || 0;
    const totalPrice = productPrice * (item.quantity || 1);

    console.log("Price of the product", totalPrice);
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
          console.log(item);
          <TouchableOpacity
            style={{ alignSelf: "flex-end", position: "absolute", zIndex: 20 }}
            onPress={() => DeleteCart(item)}>
            <MaterialIcons name="delete" size={28} color="gray" />
          </TouchableOpacity>

          <Text style={styles.productName}>
            {productName.length > 20 ? productName.substring(0, 20) + "..." : productName}
          </Text>
          <Text style={styles.productPrice}>Price: ₹{productPrice}</Text>
          <Text style={styles.quantity}>Quantity: {item.quantity || 1}</Text>

          {/* <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => handleDecrement(item._id, item.quantity)}
              style={styles.iconButton}
            >
              <AntDesign name="minus" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity || 1}</Text>
            <TouchableOpacity
              onPress={() => handleIncrement(item._id)}
              style={styles.iconButton}
            >
              <AntDesign name="plus" size={20} color="#000" />
            </TouchableOpacity>
          </View> */}

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
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>

        <View style={{ marginBottom: 1, padding: 14 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', paddingBottom: 20 }}>Purchase List</Text>
          {/* Card Section */}
          {error ? (
            <Text style={styles.error}>Error: {error}</Text>
          ) : cart.length === 0 ? (
            <Text>No items in your cart.</Text>
          ) : (
            <>
              <FlatList
                data={Array.isArray(cart) && cart.length > 0 ? (showAll ? cart : cart.slice(0, 3)) : []}
                keyExtractor={(item) => `₹{item._id}`}
                renderItem={renderCartItem}
              />

              {Array.isArray(cart) && cart.length > 2 && (
                <TouchableOpacity
                  onPress={() => setShowAll(!showAll)}
                  style={{
                    marginVertical: 10,
                    backgroundColor: '#00B6F1',
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                  }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                    {showAll ? 'Show Less' : `View All Products (${cart.length})`}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Shipping Address */}
          <View style={styles.shippingContainer}>
            <TouchableOpacity
              style={styles.shippingHeader}
              onPress={() => setIsAddressExpanded(!isAddressExpanded)}>
              <View style={styles.headerContent}>
                <View style={{ backgroundColor: '#002B63', padding: 4, borderRadius: 50, borderWidth: 5, borderColor: '#00B6F1' }}>
                  <MaterialIcons name="location-pin" size={24} color="#ffff" />
                </View>
                <View style={{ textAlign: 'center' }}>
                  <Text style={styles.headerTitle}>Shipping Address</Text>
                  <Text style={[styles.headerTitle, { fontSize: 14, fontWeight: '500', color: 'gray' }]}>
                    {shippingLocation.find(item => item.id === selectedAddress)?.city || "No Address"}
                  </Text>

                </View>
              </View>
              <View
                style={{
                  backgroundColor: isAddressExpanded ? '#00B6F1' : 'transparent',
                  borderWidth: isAddressExpanded ? 0 : 2,
                  borderColor: isAddressExpanded ? 'transparent' : '#00B6F1',
                  padding: isAddressExpanded ? 2 : 1,
                  borderRadius: 50,
                }}>
                <MaterialIcons
                  name={isAddressExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={24}
                  color={isAddressExpanded ? "white" : '#00B6F1'}
                />
              </View>
            </TouchableOpacity>
            {isAddressExpanded && (
              <>
                <FlatList
                  data={shippingLocation}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.companyOption,
                        selectedAddress === item.id && styles.companyOptionSelected,
                      ]}
                      onPress={() => setSelectedAddress(item.id)}>
                      <View style={styles.optionContent}>
                        <View style={{ flexWrap: selectedAddress === item.id ? 'wrap' : '', }}>
                          <View style={{ flexDirection: 'row' }}>
                            <MaterialIcons
                              name={selectedAddress === item.id ? 'radio-button-checked' : 'radio-button-unchecked'}
                              size={24}
                              color="#00B6F1"
                              style={{ marginRight: 6 }} />
                            <Text style={[styles.companyTitle, { color: 'green' }]}>
                              {selectedAddress === item.id ? 'Delevery Address' : null}
                            </Text>
                          </View>

                          <View>
                            <Text style={{ fontSize: 16, flexShrink: 1 }}>
                              {item.city}, {item.state}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity style={styles.addressButton}>
                  <LinearGradient colors={["#002B63", "#00B6F1"]} style={styles.addressGradientButton}>
                    <Text style={styles.addressText}>Add New Address</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}




            {/* Shipping Company */}
            {/* <TouchableOpacity
              style={styles.shippingHeader}
              onPress={() => setIsCompanyExpanded(!isCompanyExpanded)}>
              <View style={styles.headerContent}>
                <View style={{ backgroundColor: '#002B63', padding: 4, borderRadius: 50, borderWidth: 5, borderColor: '#00B6F1' }}>
                  <MaterialIcons name="location-pin" size={24} color="#ffff" />
                </View>
                <View style={{ textAlign: 'center' }}>
                  <Text style={styles.headerTitle}>Shipping Company</Text>
                  <Text style={[styles.headerTitle, { fontSize: 14, fontWeight: 'medium', color: 'gray' }]}>Lorem ipsum...(From 10 am - 2 am)</Text>
                </View>
              </View>
              <View style={{
                backgroundColor: isCompanyExpanded ? '#00B6F1' : 'transparent',
                borderWidth: isCompanyExpanded ? 0 : 2,
                borderColor: isCompanyExpanded ? 'transparent' : 'gray',
                padding: isCompanyExpanded ? 2 : 1,
                borderRadius: 50,
              }}>

                <MaterialIcons
                  name={isCompanyExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={24}
                  color={isCompanyExpanded ? 'white' : 'gray'}
                />
              </View>
            </TouchableOpacity>
            {isCompanyExpanded && (
              <FlatList
                data={shippingCompanies}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.companyOption,
                      selectedCompany === item.id && styles.companyOptionSelected,
                    ]}
                    onPress={() => setSelectedCompany(item.id)}>
                    <View style={styles.optionContent}>
                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons
                          name={selectedCompany === item.id ? "radio-button-checked" : "radio-button-unchecked"}
                          size={24}
                          color="#00B6F1"
                          style={{ marginRight: 10, }}
                        />
                        <View>
                          <Text style={styles.companyTitle}>{item.name}</Text>
                          <Text style={styles.companyDescription}>{item.description}</Text>
                        </View>
                      </View>

                      <Text style={styles.companyPrice}>{item.price}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )} */}

            {/* Notes */}
            {/* <View style={styles.notesContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsChecked(!isChecked)}>
                <MaterialIcons
                  name={isChecked ? "check-box" : "check-box-outline-blank"}
                  size={24}
                  color="#00B6F1"
                  style={styles.checkbox} />
                <Text style={styles.notesText}>
                  Any notes you need regarding your orders. Don’t hesitate to contact us.
                </Text>
              </TouchableOpacity>
            </View> */}

          </View>


          {/* Payment Method */}
          <View style={styles.paymentContainer}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentTitle}>Payment Method</Text>
              <MaterialIcons name="edit" size={20} color="#00B6F1" />
            </View>
            <View style={styles.methodOptionsContainer}>
              {/* Online Option */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedMethod === "Online" && styles.selectedPaymentOption,
                ]}
                onPress={() => setSelectedMethod("Online")}>
                <View style={styles.radioButton}>
                  {selectedMethod === "Online" && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.paymentOptionText}>Online</Text>
                <View style={styles.paymentIcons}>
                  <FontAwesome5 name="paypal" size={20} color="#003087" />
                  <FontAwesome5 name="cc-mastercard" size={20} color="#F79E1B" />
                  <FontAwesome5 name="cc-visa" size={20} color="#1A1F71" />
                </View>
              </TouchableOpacity>

              {/* Cash Option */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedMethod === "Cash" && styles.selectedPaymentOption
                ]}
                onPress={() => setSelectedMethod("Cash")}>
                <View style={styles.radioButton}>
                  {selectedMethod === "Cash" && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.paymentOptionText}>Cash On Delivery</Text>
                <FontAwesome name="money" size={24} color="#28A745" />
              </TouchableOpacity>
            </View>
          </View>

          {/*Summary  */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryDetails}>
              {/* Item 1 */}
              <View style={styles.row}>
                <Text style={styles.itemName}>Price (5 items)</Text>
                <Text style={styles.itemPrice}>₹{cartTotal.toFixed(2)}</Text>
              </View>

              {/* Item 2
              <View style={styles.row}>
                <Text style={styles.itemName}>Discount</Text>
                <Text style={styles.itemPrice}>₹20.00</Text>
              </View> */}

              {/* Shipping */}
              <View style={styles.row}>
                <Text style={styles.itemName}>Delivery Charges</Text>
                <Text style={styles.itemPrice}>₹10.00</Text>
              </View>

              {/* Total */}
              <View style={[styles.row, styles.totalRow]}>
                <Text style={styles.totalText}>Total Amount</Text>
                <Text style={styles.totalPrice}>₹50.00</Text>
              </View>

            </View>
          </View>

          {/* PromoCode */}
          <View style={styles.promoCodeWrapper}>
            <View style={styles.promoCodeRow}>
              <MaterialIcons name="local-offer" size={20} color="#00B6F1" />
              <Text style={styles.promoCodeTitle}>Promo Code</Text>
            </View>

            <View style={styles.promoCodeInputWrapper}>
              <TextInput
                style={styles.promoCodeInput}
                placeholder="Enter promo code"
                placeholderTextColor="#888"
              />
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>


        </View >

      </ScrollView >

      {/* Pay Details Section - Outside ScrollView */}
      <View View style={styles.payCardContainer} >
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Pay</Text>
          {/* <Text style={[styles.totalValue, { color: '#00B6F1' }]}>₹{total.toFixed(2)}</Text> */}
          <Text style={[styles.totalValue, { color: '#00B6F1' }]}>₹{cartTotal.toFixed(2)}</Text>
        </View>

        {selectedMethod && (
          <TouchableOpacity style={styles.checkoutButton} onPress={getOrder}>
            <LinearGradient
              colors={['#002B63', '#00B6F1']}
              start={[0, 0]}
              end={[1, 0]}
              style={styles.checkoutGradientButton}>
              <Text style={styles.checkoutText}>
                {selectedMethod === "Online" ? "Continue & Pay" : "Confirm Order"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View >
    </View >


  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#f4f6f9",
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    backgroundColor: "#fff",
  },
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 12
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    resizeMode: 'contain'
  },
  details: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 18,
    color: "green",
    fontWeight: "700",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  iconButton: {
    padding: 4,
    backgroundColor: "#EB6A39",
    borderRadius: 50,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 12,
    color: "#333",
  },
  trashIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 12
  },
  confirmButton: {
    backgroundColor: "#1DA8BB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1
  },
  cancelButton: {
    borderColor: "#FF5C5C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    borderWidth: 1,
    color: 'red'
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center'
  },

  payCardContainer: {
    borderRadius: 12,
    paddingHorizontal: 10,
    width: '95%',
    alignSelf: "center",
    position: 'relative',
    bottom: 10,
    marginTop: 20
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  totalRow: {
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1DA8BB",
  },
  checkoutButton: {

  },
  checkoutGradientButton: {
    backgroundColor: '#1DA8BB',
    padding: 14,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderRadius: 50,
  },
  checkoutText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  // Invoice
  // Invoice container
  invoiceContainer: {
    // backgroundColor: "#FFFFFF",
    borderRadius: 12,
    // padding: 12,
    shadowRadius: 4,
    marginVertical: 10,
    marginBottom: 10
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  invoiceButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  solidButton: {
    backgroundColor: '#E5E5E5',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E1E4E4',
    alignItems: 'center',
    shadowColor: '#E5E5E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  solidButtonText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: 'semibold',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#002B63',
    paddingVertical: 12,
    paddingHorizontal: 1,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  outlineButtonText: {
    color: '#002B63',
    fontSize: 14,
    fontWeight: 'semibold',
  },

  //Shipping
  shippingContainer: {

  },
  shippingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginVertical: 10
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  shippingContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 4
  },
  shippingText: {
    fontSize: 16,
    color: "#333",
  },
  companyOption: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 4
  },
  companyOptionSelected: {
    backgroundColor: "#f0f8ff",
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  companyTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  companyDescription: {
    fontSize: 14,
    color: "#555",
  },
  companyPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00B6F1",
  },
  notesContainer: {
    marginTop: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  notesText: {
    fontSize: 14,
    color: "#555",
    width: '95%'
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 8,
  },

  // Payment Method
  paymentContainer: {
    marginTop: 4,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 6,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  paymentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  methodOptionsContainer: {
    // borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedPaymentOption: {
    // backgroundColor: "#F0F8FF",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#00B6F1",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00B6F1",
  },
  paymentOptionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  paymentIcons: {
    flexDirection: "row",
    gap: 10,
  },

  // Summary
  summaryCard: {
    marginTop: 10,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  summaryDetails: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontSize: 16,
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "#333",
  },
  totalRow: {
    borderBottomWidth: 0,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00B6F1",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00B6F1",
  },

  // PromoCard
  promoCodeWrapper: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  promoCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  promoCodeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 5,
  },
  promoCodeInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  promoCodeInput: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: "#333",
  },
  applyButton: {
    backgroundColor: "#00B6F1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#00B6F1'
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },

  addressButton: {
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 80,
    width: "50%",
    borderRadius: 50,
    overflow: "hidden", // Ensures content fits inside
  },

  addressGradientButton: {
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  addressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

});