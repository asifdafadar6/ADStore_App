import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    Dimensions,
    Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import TopSellItems from '../../components/pages/TopSellItems';
import MostSellItems from '../../components/pages/MostSellItems';
import RewardsCard from '../../components/pages/Rewards';
import BestOffers from '../../components/pages/BestOffer';
import { router } from 'expo-router';


export default function Dashboard() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);  // this is for active dot



    const [filterOrder, setFilterOrder] = useState([
        <TopSellItems key="TopSellItems" />,
        <MostSellItems key="MostSellItems" />,
        <RewardsCard key="RewardsCard" />,
        <BestOffers key="BestOffers" />,
    ]);

    const openFilterSheet = () => setModalVisible(true);
    const closeFilterSheet = () => setModalVisible(false);

    const applyFilter = (filterType) => {
        closeFilterSheet();
        let reorderedComponents = [];

        if (filterType === 'MostSellItems') {
            reorderedComponents = [MostSellItems, TopSellItems, RewardsCard, BestOffers];
        } else if (filterType === 'TopSellItems') {
            reorderedComponents = [TopSellItems, BestOffers, RewardsCard, MostSellItems];
        } else if (filterType === 'BestOffers') {
            reorderedComponents = [BestOffers, TopSellItems, RewardsCard, MostSellItems];
        }

        setFilterOrder(reorderedComponents.map((Comp, i) => <Comp key={i} />));

    };

    const bannerData = [
        { id: 1, image: require('../../assets/images/14.png') },
        { id: 2, image: require('../../assets/images/15.png') },
        // { id: 3, image: require('../../assets/images/14.png') },
      ];

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInput}>
                        <Ionicons name="search" size={24} color="gray" />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Search here..."
                            placeholderTextColor="#666"
                            editable={true}
                            onFocus={() => router.push('/searchBox')}
                        />
                    </View>

                    <TouchableOpacity style={styles.filterButton} onPress={openFilterSheet}>
                        <Ionicons name="filter" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* <Banners /> */}
                <FlatList
                    horizontal
                    data={bannerData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.promoImageContainer}>
                            <Image source={item.image} style={styles.promoImage} resizeMode="contain" />
                        </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                    onScroll={(event) => {
                      const index = Math.round(
                        event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
                      );
                      setCurrentIndex(index);
                    }}
                    scrollEventThrottle={16}
                    />

                {/* Dots */}
                <View style={styles.dotsContainer}>
                    {bannerData.map((_, index) => (
                        <View 
                        key={index} 
                        style={[styles.dot, index === currentIndex ? styles.activeDot : null]}                        
                        />
                    ))}
                </View>

                {/* Dynamic Filtered Content */}
                {filterOrder}

            </ScrollView>

            {/* Bottom Filter Modal */}
            <Modal visible={isModalVisible} transparent animationType="slide" onRequestClose={closeFilterSheet}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.sheetTitle}>Filter Options</Text>
                        <TouchableOpacity onPress={() => applyFilter('TopSellItems')}>
                            <Text style={styles.filterOption}>Top Selling Items</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => applyFilter('MostSellItems')}>
                            <Text style={styles.filterOption}>Most Selling Items</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => applyFilter('BestOffers')}>
                            <Text style={styles.filterOption}>Best Offers</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalCloseButton}
                            onPress={closeFilterSheet}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    searchInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 50,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    filterButton: {
        backgroundColor: '#051937',
        padding: 12,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    promoImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        paddingLeft: 10,
    },
    promoImage: {
        width: 300,
        height: 200,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#D0D0D0',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#051937',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    filterOption: {
        fontSize: 16,
        fontWeight: '500',
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: '#051937',
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        marginVertical: 8,
    },
    modalCloseButton: {
        backgroundColor: '#051937',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
