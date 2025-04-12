import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
    ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const suggestions = [
    {
        image: "https://www.designinfo.in/wp-content/uploads/2023/02/71yzJoE7WlL._SX679_-485x485-optimized.jpg",
        name: "Apple",
        slug: "in stock 10 product"
    }, {
        image: "https://www.designinfo.in/wp-content/uploads/2023/02/71yzJoE7WlL._SX679_-485x485-optimized.jpg",
        name: "Apple iPhone",
        slug: "in stock 2 product"
    }, {
        image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue-wifi_FMT_WHH?wid=1280&hei=720&fmt=p-jpg&qlt=80&.v=OVJOVlhQelp3cUxDNnpBK0hFNFYrQUxaUVVtOUhUT0c2NzZRUllPeEJTd2Nla0ZzY0hJUkxYWE1PZHIramdKSGJWU3RPOURZS0RCaG1weXBRYytNTENhUThSUC84VzArL0cyckNrL25wa0VEaXdsQXhSUVJEK2lURHg1RU5ZZUNWcnlSVk40T21vTFdCcWxRSGNlUFBR&traceId=1",
        name: "Apple iPad",
        slug: "in stock 50 product"
    },

    "Apple MacBook",
    "Apple AirPods",
    "Apple Watch",
    "Apple TV",

    {
        image: "https://samsungmobilepress.com/file/FC05AE750AD6EB0673D9E9D4C157D4FDCA91C0319D37B2827A4ACC850D3D124959298BB89A1D18EEB9531CE7B6BDB56BB43890C99A07EF46FFD865333FEC385C3A4ECDA52E32E217D32C2807BAAF403A9124FE24BD2AD9F141EA995A91D14E9095EC253173B6A26FE1DB745A586CC1ADDE7D6D440FA45C94CA365A5CF1A540E7",
        name: "Samsung",
        slug: "in stock 5 product"
    },
    "Samsung Galaxy",
    "Samsung TV",
    "Samsung Refrigerator",
    "Sony PlayStation",
    "Sony Xperia",
    "Sony Headphones",
    "Dell Laptop",
    "Dell Monitor",
    "Microsoft Surface",
];

const products = [
    { id: 1, name: 'Shirt', price: '$20', image: 'https://thehouseofrare.com/cdn/shop/products/IMG_0010_51e74518-2782-4b53-8112-a026836a45de.jpg?v=1722671264' },
    { id: 2, name: 'Shoes', price: '$50', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b6b6036a0a2c436ba5543f30348533f8_9366/STEP_N_PACE_SHOES_Black_IQ9157_01_standard.jpg' },
    { id: 3, name: 'Facewash', price: '$10', image: 'https://chosenstore.in/cdn/shop/products/Cetaphil_cleanser_1024x1024.png?v=1661583724' },
    { id: 4, name: 'Watch', price: '$100', image: 'https://guesswatches.com/cdn/shop/files/Nav_Collections_656x410_Mobile_F24_Holiday_GG_Women_b6cf622c-8b40-49dc-9cd1-6067ee626a86.png?v=1731518939&width=720' },
    { id: 5, name: 'Bag', price: '$30', image: 'https://images.jdmagicbox.com/quickquotes/images_main/fashi-tech-women-s-stylish-hand-bag-2187874925-7iox8oxq.jpg' },
];

export default function SearchBox() {
    const [searchText, setSearchText] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [previousSearches, setPreviousSearches] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const loadPreviousSearches = async () => {
            try {
                const savedSearches = await AsyncStorage.getItem('previousSearches');
                if (savedSearches) {
                    setPreviousSearches(JSON.parse(savedSearches));
                }
            } catch (error) {
                console.error('Failed to load previous searches from AsyncStorage:', error);
            }
        };
        loadPreviousSearches();
    }, []);

    const normalizedSuggestions = suggestions.map((item) => {
        if (typeof item === "string") {
            return { name: item };
        }
        return item;
    });


    const handleSearchChange = (text) => {
        setSearchText(text);
        if (text) {
            const filtered = normalizedSuggestions.filter(
                (item) =>
                    item.name && item.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleSuggestionSelect = async (item) => {
        setSearchText(item.name);
        setFilteredSuggestions([]);

        const newHistory = [
            item,
            ...previousSearches.filter((i) => i.name !== item.name),
        ];
        setPreviousSearches(newHistory);

        try {
            await AsyncStorage.setItem(
                "previousSearches",
                JSON.stringify(newHistory)
            );
        } catch (error) {
            console.error("Failed to save search history to AsyncStorage:", error);
        }

        router.push({
            pathname: "/searchToAllProduct",
            params: { item: item.name },
        });
    };

    const handleRemoveSearch = async (item) => {
        const newHistory = previousSearches.filter(i => i !== item);
        setPreviousSearches(newHistory);
        try {
            await AsyncStorage.setItem('previousSearches', JSON.stringify(newHistory));
        } catch (error) {
            console.error('Failed to remove search from AsyncStorage:', error);
        }
    };

    const renderSuggestion = ({ item }) => (
        <TouchableOpacity
            style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 8,
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
            }}
            onPress={() => handleSuggestionSelect(item)}>

            {item.image ? (
                <Image
                    source={{ uri: item.image }}
                    style={{ height: 40, width: 40, marginRight: 8, borderRadius: 6 }}
                />
            ) : null}
            <View>
                <Text style={{ fontSize: 16, color: "#333", paddingVertical: item.image ? 0 : 6 }}>{item.name}</Text>
                {
                    item.slug && (
                        <Text style={{ fontSize: 12, color: "green" }}>{item.slug}</Text>
                    )
                }
            </View>
        </TouchableOpacity>
    );

    const renderPreviousSearch = ({ item }) => (
        <View style={styles.previousSearchItem}>
            <TouchableOpacity style={styles.previousSearchButton} onPress={() => handleSuggestionSelect(item)}>
                <MaterialIcons name="history" size={24} color="black" />
                <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveSearch(item)}>
                <AntDesign name="closecircleo" size={20} color="black" />
            </TouchableOpacity>
        </View>
    );

    const renderProduct = ({ item }) => (
        <TouchableOpacity style={styles.productCard} onPress={() => { router.push('/searchToAllProduct') }}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ padding: 12 }}>

                <View style={styles.searchContainer}>

                    <View style={styles.searchSection}>
                        <View style={styles.searchInput}>
                            <Ionicons name="search" size={20} color="gray" />
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Search here..."
                                placeholderTextColor="#666"
                                value={searchText}
                                onChangeText={handleSearchChange}
                            />
                            {
                                searchText && (
                                    <TouchableOpacity onPress={() => { setSearchText('') }}>
                                        <Ionicons name="close" size={24} color="black" />
                                    </TouchableOpacity>
                                )
                            }

                        </View>
                        <TouchableOpacity>
                            <Ionicons name="mic-sharp" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                </View>

                {searchText === '' && previousSearches.length > 0 && (
                    <View style={styles.suggestionsListContainer}>
                        <Text style={styles.previousSearchesHeader}>Previous Searches</Text>
                        <FlatList
                            data={previousSearches}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderPreviousSearch}
                            style={styles.suggestionsList}
                        />
                    </View>
                )}

                {filteredSuggestions.length > 0 && searchText !== '' && (
                    <View style={styles.suggestionsListContainer}>
                        <FlatList
                            data={filteredSuggestions}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderSuggestion}
                            style={styles.suggestionsList}
                        />
                    </View>
                )}

                <View style={styles.productSection}>
                    <Text style={styles.sectionTitle}>Featured Products</Text>
                    <FlatList
                        data={products}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderProduct}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    searchSection: {
        fontSize: 18,
        backgroundColor: '#F0F0F0',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10
    },
    searchInput: {
        flex: 1,
        fontSize: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,

    },

    suggestionsList: {
        marginTop: 10,
        maxHeight: 250,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    suggestionText: {
        fontSize: 16,
        color: '#333',
    },
    previousSearchesHeader: {
        fontSize: 16,
        color: '#333',
        padding: 12,
        fontWeight: 'bold',
    },
    previousSearchItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    previousSearchButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    productSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    productPrice: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});