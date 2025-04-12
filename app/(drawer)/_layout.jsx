import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import {useMyContext} from '../../components/provider/ContextApi'

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        backgroundColor: '#002B63',
                    },
                }}
            />
        </GestureHandlerRootView>
    );
}

const CustomDrawerContent = (props) => {
    const [isCategoryOpen, setCategoryOpen] = useState(false);
    const {logout} = useMyContext()

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Image
                        source={require('../../assets/images/ADStore.png')}
                        style={{ resizeMode: 'cover', height: 50, width: 150 }}
                    />

                </View>


            </View>

            <View style={styles.profileContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Image
                        source={{
                            uri: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
                        }}
                        style={styles.profilePicture}
                    />
                    <View>
                        <Text style={styles.profileName}>Hi, Demo</Text>
                        <Text style={styles.profilePhone}>+91 91xxxxxxx</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={() => router.push('/(personalPages)/personalInformation')}>
                    <Feather name="edit" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Main Drawer Items */}
            <View style={{ flex: 1 }}>
                <DrawerItem
                    icon={({ size }) => <Icon name="home-outline" size={size} color="#fff" />}
                    label="Home"
                    labelStyle={styles.drawerLabel}
                    onPress={() => router.push('/(drawer)/(tabs)')}
                />

                {/* Categories Section */}
                <TouchableOpacity
                    style={styles.categoryHeader}
                    onPress={() => setCategoryOpen(!isCategoryOpen)}
                >
                    <View style={styles.categoryRow}>
                        <Icon name="list-outline" size={24} color="#fff" />
                        <Text style={styles.drawerLabel}>Categories</Text>
                    </View>
                    <Icon
                        name={isCategoryOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>
                {isCategoryOpen && (
                    <View style={styles.subMenu}>
                        <DrawerItem
                            icon={({ size }) => <AntDesign name="mobile1" size={size} color="#fff" />}
                            label="Mobiles"
                            labelStyle={styles.drawerLabel}
                            onPress={() => router.push('(tabs)/category')}
                        />
                        <DrawerItem
                            icon={({ size }) => <AntDesign name="laptop" size={size} color="#fff" />}
                            label="Laptops"
                            labelStyle={styles.drawerLabel}
                            onPress={() => router.push('(tabs)/category')}
                        />
                        <DrawerItem
                            icon={({ size }) => (
                                <Icon name="watch-outline" size={size} color="#fff" />
                            )}
                            label="Watch"
                            labelStyle={styles.drawerLabel}
                            onPress={() => router.push('(tabs)/category')}
                        />
                    </View>
                )}

                <DrawerItem
                    icon={({ size }) => <Icon name="chatbox-outline" size={size} color="#fff" />}
                    label="Message"
                    labelStyle={styles.drawerLabel}
                    onPress={() => router.push('/message')}
                />
                <DrawerItem
                    icon={({ size }) => <Icon name="receipt-outline" size={size} color="#fff" />}
                    label="Order"
                    labelStyle={styles.drawerLabel}
                    onPress={() => router.push('/orders')}
                />
                <DrawerItem
                    icon={({ size }) => <Icon name="heart-outline" size={size} color="#fff" />}
                    label="Wishlist"
                    labelStyle={styles.drawerLabel}
                    onPress={() => router.push('/(tabs)/wishlist')}
                />
                <DrawerItem
                    icon={({ size }) => <Icon name="settings-outline" size={size} color="#fff" />}
                    label="Setting"
                    labelStyle={styles.drawerLabel}
                    onPress={() => router.push('/(tabs)/profile')}
                />
            </View>

            {/* Logout Button */}
            <View style={styles.logoutContainer}>
                <DrawerItem
                    icon={({ size }) => <Icon name="log-out-outline" size={size} color="#fff" />}
                    label="Logout"
                    labelStyle={styles.drawerLabel}
                    onPress={() => {
                        logout();
                        router.replace('(auth)');
                      }}
                />
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    profilePicture: {
        width: 60,
        height: 60,
        borderRadius: 50,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    profilePhone: {
        fontSize: 14,
        color: '#ddd',
    },
    drawerLabel: {
        fontSize: 16,
        color: '#fff',
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    subMenu: {
        marginLeft: 30,
        marginTop: 5,
    },
    logoutContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
        marginBottom: 10,
    },
});
