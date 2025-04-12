import { router, Tabs } from 'expo-router';
import Icon from "react-native-vector-icons/Ionicons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Feather } from '@expo/vector-icons';

import { Image, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useMyContext } from '../../../components/provider/ContextApi';



export default function TabLayout() {
  const { cartItemLength } = useMyContext()

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: 'relative',
          bottom: 10,
          left: 14,
          right: 14,
          height: 72,
          elevation: 0,
          backgroundColor: '#002B63',
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 14
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#EB6A39',
        headerTitle: '',
        headerStyle: {
          backgroundColor: '#ffff',
          shadowColor: '#051937',
          elevation: 0,
        },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <View style={styles.drawerButtonContainer}>
            <DrawerToggleButton tintColor="#051937" />
          </View>

        ),
        headerRight: () => (
          <>
            <TouchableOpacity onPress={() => { router.push('/notification') }} style={styles.cartButton}>
              <Icon name="notifications-outline" size={28} color="#051937" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { router.push('/myCart') }} style={styles.cartButton}>
              {
                cartItemLength > 0 && (
                  <Text style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    backgroundColor: 'red',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 'bold',
                    paddingVertical: 2,
                    paddingHorizontal: 6,
                    borderRadius: 50,
                    zIndex: 20,
                  }}>{cartItemLength || ""}</Text>

                )
              }

              <Icon name="cart-outline" size={28} color="#051937" />
            </TouchableOpacity>
          </>
        ),
        headerTitle: () => (
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/ADStore.png')}
              style={styles.logo}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  backgroundColor: focused ? '#00B6F1' : null, //#EB6A39
                  borderRadius: 30,
                  marginBottom: focused ? 20 : 0,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: focused ? 0.3 : 0,
                  shadowRadius: 5,
                  elevation: focused ? 8 : 0,
                  paddingTop: focused ? null : 24
                }}
              >
                <Feather
                  size={24}
                  name="home"
                  color={focused ? '#ffffff' : color}
                />
                {!focused && (
                  <Text
                    style={{
                      color: color,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Home
                  </Text>
                )}
              </View>
            );
          },

        }}
      />

      <Tabs.Screen
        name="category"
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  backgroundColor: focused ? '#00B6F1' : null,
                  borderRadius: 30,
                  marginBottom: focused ? 20 : 0,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: focused ? 0.3 : 0,
                  shadowRadius: 5,
                  elevation: focused ? 8 : 0,
                  paddingTop: focused ? null : 24
                }}
              >

                <AntDesign name={focused ? "appstore1" : "appstore-o"} size={24} color={focused ? '#ffffff' : color} />
                {!focused && (
                  <Text
                    style={{
                      color: color,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Category
                  </Text>
                )}
              </View>
            );
          },

        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  backgroundColor: focused ? '#00B6F1' : null,
                  borderRadius: 30,
                  marginBottom: focused ? 20 : 0,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: focused ? 0.3 : 0,
                  shadowRadius: 5,
                  elevation: focused ? 8 : 0,
                  paddingTop: focused ? null : 24
                }}
              >
                <AntDesign
                  size={24}
                  name={focused ? "heart" : "hearto"}
                  color={focused ? '#ffffff' : color}
                />
                {!focused && (
                  <Text
                    style={{
                      color: color,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Wishlist
                  </Text>
                )}
              </View>
            );
          },

        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  backgroundColor: focused ? '#00B6F1' : null,
                  borderRadius: 30,
                  marginBottom: focused ? 20 : 0,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: focused ? 0.3 : 0,
                  shadowRadius: 5,
                  elevation: focused ? 8 : 0,
                  paddingTop: focused ? null : 24
                }}>
                <AntDesign
                  size={24}
                  name="user"
                  color={focused ? '#ffffff' : color}
                />
                {!focused && (
                  <Text
                    style={{
                      color: color,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Profile
                  </Text>
                )}
              </View>
            );
          },

        }}
      />


    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  drawerButtonContainer: {
    transform: [{ scale: 1.1 }],
    backgroundColor: '#f4f4f4',
    borderRadius: 4,
    marginLeft: 1
  },
  logoContainer: {
    // position: 'absolute',
    // left: '50%',
    // transform: [{ translateX: -40 }],
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  cartButton: {
    marginRight: 10,
  },
});
