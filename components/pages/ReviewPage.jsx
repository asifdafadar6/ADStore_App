import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const API_BASE_URL = 'https://ipawnode.apdux.tech/api';

export default function ReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [rating, setRating] = useState(5);
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchReviews();
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');

            if (userData) {
                const parsedData = JSON.parse(userData);
                setUserName(parsedData.payload.userName);
                setUserId(parsedData.payload.id);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/review`);
            setReviews(response.data.all_data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        const TOKEN = await AsyncStorage.getItem("userToken");
        if (!reviewText.trim()) {
            Alert.alert('Error', 'Review cannot be empty!');
            return;
        }

        const reviewData = {
            feedback: reviewText,
            name: userName,
            product: '',
            rating: rating,
            userId: userId,
            image: image || '',
        };
        try {
            await axios.post(`${API_BASE_URL}/review/insert`, reviewData, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
            });
            fetchReviews();
            setReviewText('');
            setImage(null);
            setRating(5);
        } catch (error) {
            Alert.alert('Error', 'Failed to submit review');
            console.error('Error submitting review:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/delete/${id}`);
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>User Reviews</Text>
            <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <MaterialIcons
                            name={star <= rating ? 'star' : 'star-border'}
                            size={36}
                            color={star <= rating ? '#ffd700' : '#ccc'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <FlatList
                data={reviews}
                keyExtractor={(item) => item._id}
                horizontal // <-- This enables side-by-side scrolling
    showsHorizontalScrollIndicator={false} // Optional: hides scrollbar
    contentContainerStyle={{ paddingHorizontal: 10 }} // Optional: padding
                renderItem={({ item }) => (
                    <View style={styles.reviewCard}>
                        <Text style={styles.reviewText}>{item.feedback}</Text>
                        <Text style={styles.userText}>- {item.name}</Text>
                        <View style={styles.ratingContainer}>
                            {[...Array(5)].map((_, index) => (
                                <MaterialIcons
                                    key={index}
                                    name={index < parseInt(item.rating) ? 'star' : 'star-border'}
                                    size={22}
                                    color={index < parseInt(item.rating) ? "#ffd700" : "#ccc"}
                                />
                            ))}
                        </View>
                        {item.image ? <Image source={{ uri: item.image }} style={styles.reviewImage} /> : null}
                        {/* <TouchableOpacity onPress={() => handleDelete(item._id)}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity> */}
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No reviews yet. Be the first to review!</Text>}
            />


            {/* <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <MaterialIcons
                            name={star <= rating ? 'star' : 'star-border'}
                            size={36}
                            color={star <= rating ? '#ffd700' : '#ccc'}
                        />
                    </TouchableOpacity>
                ))}
            </View> */}


            {/* <TextInput
                style={styles.input}
                placeholder="Write your review..."
                value={reviewText}
                onChangeText={setReviewText}
            /> */}

            {/* <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <MaterialIcons name="photo-library" size={24} color="white" />
                <Text style={styles.buttonText}> Upload Image</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.previewImage} />}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Review</Text>
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
    heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    reviewCard: {width: 150, marginRight: 10, backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, elevation: 3 },
    reviewText: { fontSize: 14, fontWeight: '500' },
    userText: { fontSize: 14, color: '#666', marginTop: 4 },
    reviewImage: { width: 30, height: 30, borderRadius: 8, marginTop: 5 },
    deleteText: { color: 'red', marginTop: 6, fontWeight: 'bold' },
    emptyText: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 10 },
    input: { height: 50, borderColor: '#bbb', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#fff', marginBottom: 12 },
    button: { backgroundColor: '#007bff', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
    imageButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007bff', paddingVertical: 14, borderRadius: 10, marginBottom: 12 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    previewImage: { width: 100, height: 100, borderRadius: 10, marginVertical: 10 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 0, marginBottom: 20 },
});