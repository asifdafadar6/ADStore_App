import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Modal,
} from 'react-native';
import SearchToAllProducts from '../../components/pages/SearchToAllProducts';
import { Ionicons } from '@expo/vector-icons';
import { router, useGlobalSearchParams } from 'expo-router';

export default function searchToAllProduct() {
    const [filters, setFilters] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const item = useGlobalSearchParams();

    // Open modal
    const openFilterSheet = () => {
        setIsModalVisible(true);
    };

    // Close modal
    const closeFilterSheet = () => {
        setIsModalVisible(false);
    };

    // Handle filter selection
    const applyFilter = (filter) => {
        setFilters(filter);
        closeFilterSheet();
    };

    return (
        <>
            <TouchableOpacity onPress={() => router.push('/searchBox')}>
                <View style={styles.searchContainer}>
                    <View style={styles.searchInput}>
                        <Ionicons name="search" size={24} color="gray" />
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder="Search here..."
                            placeholderTextColor="#666"
                            editable={false}
                            value={item.item} // Display the extracted value
                        />

                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={openFilterSheet}>
                        <Ionicons name="filter" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <SearchToAllProducts item={item} filters={filters} />

            {/* Custom Modal for Filters */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeFilterSheet}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.sheetTitle}>Filter Options</Text>
                        <TouchableOpacity onPress={() => applyFilter('lowToHigh')}>
                            <Text style={styles.filterOption}>Price: Low to High</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => applyFilter('highToLow')}>
                            <Text style={styles.filterOption}>Price: High to Low</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={closeFilterSheet}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingTop: 10,
        backgroundColor: '#EB6A39',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#F0F0F0',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 10,
        gap: 4

    },
    filterButton: {
        backgroundColor: '#051937',
        padding: 12,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    filterOption: {
        fontSize: 16,
        paddingVertical: 8,
    },
    closeButton: {
        marginTop: 16,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#EB6A39',
        borderRadius: 8,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
