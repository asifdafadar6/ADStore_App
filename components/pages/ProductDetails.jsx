import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, SafeAreaView, FlatList, Image, StyleSheet, Dimensions, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useMyContext } from '../provider/ContextApi';
import { postCart } from '../provider/api/cart_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewPage from './ReviewPage';



export default function ProductDetails({ params }) {
    const router = useRouter();
    console.log("params._id",params._id);

    const { wishItem, toggleWishlist, isLoading } = useMyContext();

    const [expanded, setExpanded] = useState(false);

    let parsedAttributes = [];
    try {
        if (params.attributes) {
            if (typeof params.attributes === "string") {
                parsedAttributes = JSON.parse(params.attributes);
            } else if (Array.isArray(params.attributes)) {
                parsedAttributes = params.attributes;
            } else {
                console.error("Unexpected attributes format:", params.attributes);
            }
        }
    } catch (error) {
        console.error("Failed to parse attributes:", error);
    }

    // Ensure parsedAttributes is always an array
    parsedAttributes = Array.isArray(parsedAttributes) ? parsedAttributes : [];

    // Filter attributes safely
    const colorAttributes = parsedAttributes.filter(attr => attr.name === "Color");

    console.log("Filtered Colors:", colorAttributes);



    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);

    const images = typeof params.multipleImages === 'string'
        ? params.multipleImages.split(',')
        : params.multipleImages;


    const handleScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const screenWidth = event.nativeEvent.layoutMeasurement.width;
        const newIndex = Math.round(offsetX / screenWidth);
        setCurrentIndex(newIndex);
    };

    const productPrice = params.salePriceAmount;

    const incrementQuantity = () => {
        const maxQty = parseInt(params.maximumQty) || 10;
        setQuantity(prev => Math.min(prev + 1, maxQty));
    };

    const decrementQuantity = () => {
        const minQty = parseInt(params.minimumQty) || 1;
        setQuantity(prev => Math.max(prev - 1, minQty));
    };


    const handleAddToCart = async (id, quantity) => {
        console.log("Cart ids:", id, quantity);
        try {
            const token = await AsyncStorage.getItem("userToken");
            const response = await postCart(id, quantity);
            console.log("Cart response:", response);
            if (response) {
                router.push('/myCart');
            }
        } catch (err) {
            console.error("Error fetching product:", err.message);
            setError(err.message);
        }
    };


    const [selectedImage, setSelectedImages] = useState(images);

    // Handle color click
    const handleColorClick = (colorImages) => {
        setSelectedImages(colorImages);
        setCurrentIndex(0);
    };
    const handleColorReset = () => {
        setSelectedImages(images);
        setCurrentIndex(0);
    };

    console.log('ProductId', params._id);
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.heartContainer}>
                    <TouchableOpacity onPress={() => {router.back(); }}>
                        <AntDesign
                            name="leftcircleo"
                            size={30}
                            color={'#051937'}
                            style={styles.heartIcon}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => !isLoading && toggleWishlist(params._id)}
                        disabled={isLoading}>
                        <AntDesign
                            name={wishItem.some((wish) => wish._id === params._id) ? 'heart' : 'hearto'}
                            size={28}
                            color={wishItem.some((wish) => wish._id === params._id) ? 'red' : "#051937"}
                            style={styles.heartIcon}
                        />
                    </TouchableOpacity>

                </View>

                {/* Horizontal Scrollable Images */}
                <FlatList
                    data={selectedImage}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.trim() }}
                                style={styles.image}
                                resizeMode="contain" />
                        </View>
                    )}
                    onScroll={handleScroll}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                />

                {/* Dots for Indicator */}
                <View style={styles.dotsContainer}>
                    {selectedImage.map((_, index) => (
                        <View
                            key={index}
                            style={[styles.dot, currentIndex === index && styles.activeDot]}
                        />
                    ))}
                </View>

                {/* Product Details */}
                <View style={styles.productDetailsContainer}>
                    {
                        colorAttributes.length > 0 && (
                            <View
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 24,
                                    backgroundColor: 'white',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                    borderRadius: 50,
                                    alignSelf: 'center',
                                    position: 'absolute',
                                    top: -20,
                                }}>
                                <View
                                    style={{
                                        alignSelf: 'center',
                                        borderRadius: 10,
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        gap: 10,
                                        justifyContent: 'center',
                                        paddingHorizontal: 10,
                                    }}>
                                    <TouchableOpacity onPress={() => handleColorReset()}>
                                        <View
                                            style={{
                                                backgroundColor: '#f6f6f6',
                                                height: 24,
                                                width: 24,
                                                borderRadius: 15,
                                                borderWidth: 1,
                                                borderColor: '#ddd',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                overflow: 'hidden'
                                            }}>
                                            {/* Diagonal cross or mark */}
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    height: 30,
                                                    width: 2,
                                                    backgroundColor: 'red',
                                                    transform: [{ rotate: '45deg' }],
                                                }}
                                            />

                                        </View>
                                    </TouchableOpacity>

                                    {(parsedAttributes || [])
                                        .filter((item) => item.name === 'Color')
                                        .map((item, index) => (
                                            <View key={index} style={{ alignItems: 'center', marginHorizontal: 5 }}>
                                                <TouchableOpacity onPress={() => handleColorClick(item.images)}>
                                                    <View
                                                        style={{
                                                            backgroundColor: item.value?.toLowerCase() || 'transparent',
                                                            height: 24,
                                                            width: 24,
                                                            borderRadius: 15,
                                                            borderWidth: 1,
                                                            borderColor: '#ddd',
                                                        }}
                                                    />
                                                </TouchableOpacity>

                                            </View>
                                        ))}

                                </View>
                            </View>
                        )
                    }

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <AntDesign name="star" size={20} color="gold" />
                        <Text style={styles.productRating}>{4.8}</Text>
                    </View>

                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
                        <Text style={styles.productName}>
                            {params.productName.split(" ").slice(0, 10).join(" ")}
                            {params.productName.split(" ").length > 10 ? "..." : ""}
                        </Text>

                        <View>
                            <Text style={[styles.productPrice, { fontWeight: '500', fontSize: 18, textDecorationLine: 'line-through', color: '#888' }]}>₹{params.regularPrice * quantity}</Text>
                            <Text style={styles.productPrice}>₹{(productPrice * quantity)}</Text>
                        </View>

                    </View>


                    {/* Quantity Selector */}
                    <View style={styles.quantityContainer}>
                        <Text style={{ fontSize: 18 }}>Quantity</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#07657E0D', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 }}>

                            <TouchableOpacity onPress={incrementQuantity}>
                                <Text style={styles.button}>
                                    <AntDesign name="plus" size={24} color="#00B6F1" />
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity onPress={decrementQuantity}>
                                <Text style={styles.button}>
                                    <AntDesign name="minus" size={24} color="#00B6F1" />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Add Note Button */}
                    {/* <TouchableOpacity style={styles.addNoteButton} onPress={() => setModalVisible(true)}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                            <FontAwesome6 name="sticky-note" size={20} color="#00B6F1" />
                            <Text style={styles.addNoteText}>Add a note</Text>
                        </View>
                    </TouchableOpacity> */}

                    {/* Seller Info */}
                    <View style={styles.sellerInfoContainer}>

                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View style={{ backgroundColor: '#8BBCDA33', padding: 8, borderRadius: 50 }}>
                                <AntDesign name="Trophy" size={24} color="#00B6F1" />
                            </View>

                            <View>
                                <Text>Seller</Text>
                                <Text style={{ color: '#00B6F1', fontSize: 16 }}>Fahim Gazi</Text>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                            <View style={{ backgroundColor: '#8BBCDA33', padding: 8, borderRadius: 50 }}>
                                <Feather name="truck" size={24} color="#00B6F1" />
                            </View>

                            <View>
                                <Text>Deliver By</Text>
                                <Text style={{ color: '#00B6F1', fontSize: 16 }}>AD Store</Text>
                            </View>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionContainer}>
                        <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: "600" }}>
                            Description
                        </Text>

                        <Text
                            style={{ fontSize: 16, lineHeight: 24, color: "gray" }}
                            numberOfLines={expanded ? undefined : 2}>
                            {params.description}
                        </Text>

                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 5,
                            }}
                            onPress={() => setExpanded(!expanded)}>
                            <Text style={{ fontSize: 16, color: "#00B6F1" }}>
                                {expanded ? "Read less" : "Read more"}
                            </Text>
                            <Feather
                                name={expanded ? "chevron-up" : "chevron-right"}
                                size={16}
                                color="#00B6F1"
                            />
                        </TouchableOpacity>
                    </View>


                    {/* Add to Cart Button */}
                    <View style={styles.addBuy}> 
                    <TouchableOpacity style={styles.gradientButton} onPress={() => { handleAddToCart(params._id, quantity) }}>
                        <LinearGradient
                            colors={['#002B63', '#00B6F1']}
                            start={[0, 0]}
                            end={[1, 0]}
                            style={styles.addToCartButton}>
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    
                    {/* Buy Now Button */}
                    <TouchableOpacity style={styles.gradientButton} onPress={() => { router.push({
                        pathname: "/CheckOut" , 
                        params: {productID: params._id}
                    }) }}>
                        <LinearGradient
                            colors={['#002B63', '#00B6F1']}
                            start={[0, 0]}
                            end={[1, 0]}
                            style={styles.buyNowButton}>
                            <Text style={styles.buyNowText}>Buy Now</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    </View>

                    {/* Review */}
                    <ReviewPage />
                    {
                        parsedAttributes.length > 0 && (
                            <View>
                                <View style={{ marginTop: 12 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
                                        Product Attributes
                                    </Text>
                                    {
                                        parsedAttributes.map((item, index) => (
                                            <View key={index} style={{ marginVertical: 10, }}>
                                                {item.name === "Color" ? (
                                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <View
                                                            style={{
                                                                backgroundColor: item.value.toLowerCase(),
                                                                height: 24,
                                                                width: 24,
                                                                borderRadius: 15,
                                                                marginRight: 10,
                                                                borderWidth: 1,
                                                                borderColor: '#ddd',
                                                            }}
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize: 16,
                                                                color: '#333',
                                                                fontWeight: '500',
                                                            }}>
                                                            {item.value}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <View style={{
                                                        flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: '#f2f2f2'
                                                    }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 16,
                                                                color: '#555',
                                                                fontWeight: '500',
                                                                flex: 1,

                                                            }}>
                                                            {item.name}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 16,
                                                                color: '#333',
                                                                fontWeight: '500',
                                                                flex: 2,
                                                                textAlign: 'right',
                                                            }}>
                                                            {item.value}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        ))
                                    }
                                </View>
                            </View>
                        )
                    }

                </View>

                {/* Modal for Notes */}
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text>Add a note for the product</Text>
                            <TextInput style={styles.textInput} placeholder="Enter your note" />
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.button}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView >
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D9D9D966',
    },
    scrollView: {

    },
    scrollContainer: {

    },

    heartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 12,
        // backgroundColor:"black"

    },
    heartIcon: {
        zIndex: 10,
    },
    productDetailsContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: width - 0,
        // backgroundColor:"black"

    },
    imageContainer: {
        width: width - 0,
        height: (width - 40) * 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:"red"

    },
    image: {
        width: '100%',
        height: '100%',
        // backgroundColor:"black"
    },
    productRating: {
        fontSize: 24,
        fontWeight: 'semibold',
        marginVertical: 5,
        alignItems: 'center'

    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00B6F1',
    },
    pickerContainer: {
        backgroundColor: "red",

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    label: {
        fontSize: 18,
        color: '#333',
    },
    buttonGroup: {
        flexDirection: 'row',
    },
    sizeButton: {
        backgroundColor: '#07657E0D',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 50,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedButton: {
        backgroundColor: '',
        borderColor: '#07657E',
        color: '#07657E',
    },
    sizeButtonText: {
        color: '#07657E',
    },
    selectedText: {
        color: '#07657E',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,

    },
    dropdownLabel: {
        fontSize: 18,
        marginRight: 50,
    },
    pickerWrapper: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#07657E',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#FFF',
    },
    pickerContent: {
        width: '50%',
        height: 30,
        color: '#07657E',
    },

    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'space-between'
    },
    button: {
        fontSize: 24,
        marginHorizontal: 10,
        color: '#EB6A39'
    },
    quantityText: {
        fontSize: 18,
    },
    picker: {
        height: 20,
        width: '100%',
    },
    addNoteButton: {
        backgroundColor: '#07657E1A',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    addNoteText: {
        color: '#00B6F1',
        fontSize: 16,
        textAlign: 'center'
    },
    sellerInfoContainer: {
        marginTop: 10,
    },
    descriptionContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    addBuy: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        marginRight: 70,
        gap: 20,
    },
    addToCartButton: {
        backgroundColor: '#1DA8BB',
        padding: 15,
        marginVertical: 10,
        width: '130%',
        alignItems: 'center',
        borderRadius: 50,
    },
    addToCartText: {
        color: 'white',
        fontSize: 18,
    },
    buyNowButton: {
        backgroundColor: '#1DA8BB',
        padding: 15,
        marginVertical: 10,
        width: '130%',
        alignItems: 'center',
        borderRadius: 50,
        marginLeft: 30,
    },
    buyNowText: {
        color: 'white',
        fontSize: 18,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 34,
        marginTop: 16,
        alignItems: 'center'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 50,
        backgroundColor: '#C4C4C4',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#1DA8BB',
        width: 12,
        height: 12,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: width - 40,
    },
    textInput: {
        borderWidth: 1,
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },

    buttonContainer: {
        borderRadius: 25,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
