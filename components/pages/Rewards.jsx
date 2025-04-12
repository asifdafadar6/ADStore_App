import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';

// Sample data array
const rewards = [
    { id: 1, title: '50% OFF', image:require('../../assets/images/rewardImg.png') },
    { id: 2, title: '40% OFF', image:require('../../assets/images/rewardImg.png') },
    { id: 3, title: '60% OFF', image:require('../../assets/images/rewardImg.png') },
];

const renderRewardsItem = ({ item }) => (
    <TouchableOpacity key={item.id} activeOpacity={1}>
    <View style={styles.cardContainer}>
        {/* Title Section */}
        <Text style={styles.titleText}>{item.title}</Text>
        <Image source={item.image} /> 
    </View>
    </TouchableOpacity>
);

const renderSection = (title, data) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={data}
            renderItem={renderRewardsItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatList}
        />
    </View>
);

export default function RewardsCard() {
    return <View style={styles.container}>{renderSection('Rewards & Coupons', rewards)}</View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 12,
    },
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 20,
        paddingHorizontal:14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAllText: {
        fontSize: 14,
        color: '#002B63',
        fontWeight: 'bold',
    },
    flatList: {
        paddingHorizontal: 10,
    },
    cardContainer: {
        width: 200,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginRight: 12,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        position: 'relative',
        zIndex: 50,
        marginBottom: 10,
        alignItems:'center'
    },
    titleText: {
        position:'absolute',
        zIndex:10,
        top:20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 14,
        color: '#005F73',
        marginBottom: 16,
    },
    couponContainer: {
        backgroundColor: '#E5F4F9',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 16,
        width: '80%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0084A6',
    },
    couponText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#005F73',
    },
    button: {
        backgroundColor: '#0084A6',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 4,
    },
    buttonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'semibold',
    },
});
