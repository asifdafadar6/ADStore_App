// import React, { useState } from 'react';
// import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import { router } from 'expo-router';


// export default function Profile() {

//     const menuItems = [
//         {
//             icon: 'person-outline',
//             text: 'Personal Information',
//         },
//         {
//             icon: 'receipt-long',
//             text: 'Verify & Invoice Details',
//         },
//         {
//             icon: 'location-on',
//             text: 'Location',
//         },
//         {
//             icon: 'settings',
//             text: 'Settings',
//         },
//         {
//             icon: 'receipt-long',
//             text: 'Orders',
//         },
//     ];
//     const savingItems = [
//         {
//             icon: 'savings',
//             text: 'Offers & Discount',
//         },
//     ]
//     const helpItems = [
//         {
//             icon: 'support-agent',
//             text: 'Technical Support',
//         },
//         {
//             icon: 'privacy-tip',
//             text: 'Privacy Policy',
//         },
//         {
//             icon: 'bookmark',
//             text: 'Terms & Condition',
//         },
//         {
//             icon: 'logout',
//             text: 'Logout',
//         },
//     ]

//     const [profileImage, setProfileImage] = useState(
//         'https://www.cgg.gov.in/wp-content/uploads/2017/10/dummy-profile-pic-male1-300x300.jpg'
//     );

//     const uploadImage = async () => {
//         const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//         if (permissionResult.granted === false) {
//             alert('Permission to access camera roll is required!');
//             return;
//         }
//         const pickerResult = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 1,
//         });

//         if (!pickerResult.canceled) {
//             setProfileImage(pickerResult.assets[0].uri);
//         }
//     };

//     const handlePersonal = (item) => {
//         console.log("item", item.text);
//         if (item.text === "Personal Information") {
//             router.push({
//                 pathname: '/(personalPages)/personalInformation'
//             })
//         } if (item.text === "Verify & Invoice Details") {
//             router.push({
//                 pathname: '/(personalPages)/invoice'
//             })
//         } if (item.text === "Location") {
//             router.push({
//                 pathname: '/(personalPages)/location'
//             })
//         } if (item.text === "Settings") {
//             router.push({
//                 pathname: '/(personalPages)/settings'
//             })
//         } if (item.text === "Orders") {
//             router.push({
//                 pathname: '/orders'
//             })
//         }
//     }

//     const handleSavings = (item) => {
//         console.log("item", item.text);
//         if (item.text === "Offers & Discount") {
//             router.push({
//                 pathname: '/(offersPages)/offers'
//             })
//         }
//     }

//     const handleHelp = (item) => {
//         console.log("item", item.text);
//         if (item.text === "Logout") {
//             router.push({
//                 pathname: '/(auth)/SignIn'
//             })
//         }
//     }

    
//     return (
//         <View style={styles.container}>
//             <ScrollView contentContainerStyle={styles.scrollView}>
//                 {/* Profile Section */}
//                 <View style={styles.profileSection}>
//                     <View style={styles.profileImageWrapper}>
//                         <Image
//                             source={{ uri: profileImage }}
//                             style={styles.profileImage}
//                         />
//                         <TouchableOpacity style={styles.editIcon} onPress={uploadImage}>
//                             <MaterialIcons name="edit" size={20} color="white" />
//                         </TouchableOpacity>
//                     </View>
//                 </View>


//                 {/* Buttons Section */}
//                 <View style={styles.buttonsSection}>
//                     <TouchableOpacity style={styles.button} onPress={() => {
//                         router.push('/wallet')
//                     }}>
//                         <MaterialIcons name="account-balance-wallet" size={20} color="#00B6F1" />
//                         <Text style={styles.buttonText}>Wallet</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.button} onPress={() => {
//                         router.push('/wishlist')
//                     }}>
//                         <MaterialIcons name="favorite-outline" size={20} color="#00B6F1" />
//                         <Text style={styles.buttonText}>Wishlist</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Personal Information */}
//                 <View style={styles.menuContainer}>
//                     <Text style={styles.heading}>Personal Information</Text>
//                     {menuItems.map((item, index) => (
//                         <TouchableOpacity key={index} style={styles.menuItem}
//                             onPress={() => { handlePersonal(item) }}>
//                             <View style={styles.menuIconText}>
//                                 <MaterialIcons name={item.icon} size={20} color="black" />
//                                 <Text style={styles.menuText}>{item.text}</Text>
//                             </View>
//                             <MaterialIcons name="chevron-right" size={20} color="black" />
//                         </TouchableOpacity>
//                     ))}
//                 </View>


//                 {/* Savings Information */}
//                 <View style={styles.menuContainer}>
//                     <Text style={styles.heading}>Savings</Text>
//                     {savingItems.map((item, index) => (
//                         <TouchableOpacity key={index} style={styles.menuItem} onPress={()=>{handleSavings(item)}}>
//                             <View style={styles.menuIconText}>
//                                 <MaterialIcons name={item.icon} size={20} color="black" />
//                                 <Text style={styles.menuText}>{item.text}</Text>
//                             </View>
//                             <MaterialIcons name="chevron-right" size={20} color="black" />
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {/* Help Information */}
//                 <View style={styles.menuContainer}>
//                     <Text style={styles.heading}>Help</Text>
//                     {helpItems.map((item, index) => (
//                         <TouchableOpacity key={index} style={styles.menuItem} onPress={()=>{handleHelp(item)}}>
//                             <View style={styles.menuIconText}>
//                                 <MaterialIcons name={item.icon} size={20} color="black" />
//                                 <Text style={styles.menuText}>{item.text}</Text>
//                             </View>
//                             <MaterialIcons name="chevron-right" size={20} color="black" />
//                         </TouchableOpacity>
//                     ))}
//                 </View>



//             </ScrollView>
//         </View>
//     );
// }

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
    const [profileImage, setProfileImage] = useState(
        'https://www.cgg.gov.in/wp-content/uploads/2017/10/dummy-profile-pic-male1-300x300.jpg'
    );
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const menuItems = [
        {
            icon: 'person-outline',
            text: 'Personal Information',
        },
        {
            icon: 'receipt-long',
            text: 'Verify & Invoice Details',
        },
        {
            icon: 'location-on',
            text: 'Location',
        },
        {
            icon: 'settings',
            text: 'Settings',
        },
        {
            icon: 'receipt-long',
            text: 'Orders',
        },
    ];
    const savingItems = [
        {
            icon: 'savings',
            text: 'Offers & Discount',
        },
    ]
    const helpItems = [
        {
            icon: 'support-agent',
            text: 'Technical Support',
        },
        {
            icon: 'privacy-tip',
            text: 'Privacy Policy',
        },
        {
            icon: 'bookmark',
            text: 'Terms & Condition',
        },
        {
            icon: 'logout',
            text: 'Logout',
        },
    ]

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedData = await AsyncStorage.getItem("userData");
                if (!storedData) {
                    Alert.alert("Error", "User data not found");
                    setLoading(false);
                    return;
                }
                
                const parsedData = JSON.parse(storedData);
                const userId = parsedData.payload.id;
                
                const response = await axios.get(`https://ipawnode.apdux.tech/api/viewprofilebyid/${userId}`);
                setUserData(response.data.userDetails);
                
                // Set profile image if available
                if (response.data.userDetails.profileImage) {
                    setProfileImage(response.data.userDetails.profileImage);
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                Alert.alert("Error", "Failed to fetch user data");
                setLoading(false);
            }
        };
        
        fetchUserData();
    }, []);

    const uploadImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setProfileImage(pickerResult.assets[0].uri);
            // Here you would typically also upload the image to your server
        }
    };

    const handlePersonal = (item) => {
        console.log("item", item.text);
        if (item.text === "Personal Information") {
            router.push({
                pathname: '/(personalPages)/personalInformation'
            })
        } if (item.text === "Verify & Invoice Details") {
            router.push({
                pathname: '/(personalPages)/invoice'
            })
        } if (item.text === "Location") {
            router.push({
                pathname: '/(personalPages)/location'
            })
        } if (item.text === "Settings") {
            router.push({
                pathname: '/(personalPages)/settings'
            })
        } if (item.text === "Orders") {
            router.push({
                pathname: '/orders'
            })
        }
    }

    const handleSavings = (item) => {
        console.log("item", item.text);
        if (item.text === "Offers & Discount") {
            router.push({
                pathname: '/(offersPages)/offers'
            })
        }
    }

    const handleHelp = (item) => {
        console.log("item", item.text);
        if (item.text === "Logout") {
            router.push({
                pathname: '/(auth)/SignIn'
            })
        }
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageWrapper}>
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity style={styles.editIcon} onPress={uploadImage}>
                            <MaterialIcons name="edit" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    {userData && (
                        <>
                            <Text style={styles.userName}>{userData.userName}</Text>
                            <Text style={styles.userEmail}>{userData.email}</Text>
                            <Text style={styles.membership}>Membership: {userData.membership}</Text>
                        </>
                    )}
                </View>

                {/* Buttons Section */}
                <View style={styles.buttonsSection}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        router.push('/wallet')
                    }}>
                        <MaterialIcons name="account-balance-wallet" size={20} color="#00B6F1" />
                        <Text style={styles.buttonText}>Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        router.push('/wishlist')
                    }}>
                        <MaterialIcons name="favorite-outline" size={20} color="#00B6F1" />
                        <Text style={styles.buttonText}>Wishlist</Text>
                    </TouchableOpacity>
                </View>

                {/* Personal Information */}
                <View style={styles.menuContainer}>
                    <Text style={styles.heading}>Personal Information</Text>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}
                            onPress={() => { handlePersonal(item) }}>
                            <View style={styles.menuIconText}>
                                <MaterialIcons name={item.icon} size={20} color="black" />
                                <Text style={styles.menuText}>{item.text}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="black" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Savings Information */}
                <View style={styles.menuContainer}>
                    <Text style={styles.heading}>Savings</Text>
                    {savingItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={()=>{handleSavings(item)}}>
                            <View style={styles.menuIconText}>
                                <MaterialIcons name={item.icon} size={20} color="black" />
                                <Text style={styles.menuText}>{item.text}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="black" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Help Information */}
                <View style={styles.menuContainer}>
                    <Text style={styles.heading}>Help</Text>
                    {helpItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={()=>{handleHelp(item)}}>
                            <View style={styles.menuIconText}>
                                <MaterialIcons name={item.icon} size={20} color="black" />
                                <Text style={styles.menuText}>{item.text}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="black" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: 20
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 20,
    },
    scrollView: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImageWrapper: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#00B6F1',
        borderRadius: 20,
        padding: 5,
    },
    buttonsSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00B6F1',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginHorizontal: 10,
        width: 150,
        textAlign: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        marginLeft: 10,
        color: '#00B6F1',
        fontSize: 16,
        textAlign: 'center',

    },


    // Personal Information 
    menuContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        width: '100%',

    },
    menuIconText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuText: {
        marginLeft: 16,
        fontSize: 16,
        color: 'black',
    },
});
