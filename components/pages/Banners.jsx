import React, { useState, useRef } from 'react';
import {
    View, Text, FlatList, Image, TouchableOpacity,
    StyleSheet, Dimensions, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Banners() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const bannersItems = [
        {
            id: 1,
            title: 'Save Up To 25%',
            slug: 'Unlock incredible discounts',
            image: require('../../assets/images/bannerChare.png'),
            btn: 'Shop Now',
        },
        {
            id: 2,
            title: 'Save Up To 25%',
            slug: 'Unlock incredible discounts',
            image: require('../../assets/images/bannerChare.png'),
            btn: 'Shop Now',
        },
        
       
    ];

    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    const renderBanner = ({ item }) => (
        <LinearGradient
            colors={['#051937','#051937', '#EB6A39']} // Left to right gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bannerContainer}
        >
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.slug}</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{item.btn}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.bannerImage} resizeMode="contain" />
            </View>
        </LinearGradient>
    );

    return (
        <View>
            <FlatList
                data={bannersItems}
                renderItem={renderBanner}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContainer}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false, listener: handleScroll }
                )}
                scrollEventThrottle={16}
            />

            {/* Pagination Dots */}
            <View style={styles.dotsContainer}>
                {bannersItems.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            activeIndex === index ? styles.activeDot : null
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flatListContainer: {
        paddingHorizontal: 10,
    },
    bannerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width * 0.85,
        borderRadius: 15,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        position: 'relative',
        overflow: 'visible', // Important for zIndex to work
        elevation: 5, // Shadow effect for Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    textContainer: {
        flex: 1,
        zIndex: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        flexWrap:'wrap',
        width:120
    },
    subtitle: {
        fontSize: 16,
        color: '#E0E0E0',
        marginBottom: 12,
        width:140
    },
    button: {
        backgroundColor: '#FF6F00',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignSelf: 'flex-start',
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    imageContainer: {
        position: 'absolute',
        top: 20,  
        right: -40,
        zIndex: 2,  
    },
    bannerImage: {
        width: 280, 
        height: 340,
        resizeMode: 'contain',
    },

    /* Dots Pagination */
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D0D0D0',
        marginHorizontal: 6,
    },
    activeDot: {
        width: 10,
        height: 10,
        backgroundColor: '#FF6F00',
    },
});

