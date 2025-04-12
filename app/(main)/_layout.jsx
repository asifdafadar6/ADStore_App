import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


function CustomBackButton({ navigation, color }) {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back-circle" size={32} color={color || "black"} />
    </TouchableOpacity>
  );
}


export default function _layout() {

  return (
    <Stack initialRouteName='index' >
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='productDetails' options={{ headerShown: false }} />

      <Stack.Screen
        name="myCart"
        options={({ navigation }) => ({
          headerShown: true,
          title: 'My Shopping Cart',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'white'
          },
          headerStyle: {
            backgroundColor: '#00B6F1',
          },
          headerLeft: () => <CustomBackButton navigation={navigation} color={'white'} />,
        })}
      />

      <Stack.Screen
        name="notification"
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Notification',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'white'
          },
          headerStyle: {
            backgroundColor: '#00B6F1',
          },
          headerLeft: () => <CustomBackButton navigation={navigation} color={'white'} />,
        })}
      />

      <Stack.Screen
        name="checkOut"
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Check Out',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'white'
          },
          headerStyle: {
            backgroundColor: '#00B6F1',
          },
          headerLeft: () => <CustomBackButton navigation={navigation} color={'white'} />,
        })}
      />
      <Stack.Screen
        name="message"
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Chart Bot',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'white'
          },
          headerStyle: {
            backgroundColor: '#00B6F1',
          },
          headerLeft: () => <CustomBackButton navigation={navigation} color={'white'} />,
        })}
      />

      <Stack.Screen
        name="searchBox"
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Search here',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'white'
          },
          headerStyle: {
            backgroundColor: '#00B6F1',
          },
          headerLeft: () => <CustomBackButton navigation={navigation} color={'white'} />,
        })}
      />

      <Stack.Screen name='orders' options={{ headerShown: false }} />
      <Stack.Screen name='myProfile' options={{ headerShown: false }} />
      <Stack.Screen name='searchToAllProduct' options={{ headerShown: false }} />


      <Stack.Screen name='wallet'
        options={({ navigation }) => ({
          headerShown: true,
          title: 'My Wallet',
          headerTitleAlign: 'center',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })} />
      {/* Personal Information */}
      <Stack.Screen name='(personalPages)/personalInformation'
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Personal Information',
          headerTitleAlign: 'center',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })} />

      <Stack.Screen name='(personalPages)/invoice' options={({ navigation }) => ({
        headerShown: true,
        title: 'Invoice',
        headerTitleAlign: 'center',
        headerLeft: () => <CustomBackButton navigation={navigation} />,
      })} />
      <Stack.Screen name='(personalPages)/location' options={({ navigation }) => ({
        headerShown: true,
        title: 'Location',
        headerTitleAlign: 'center',
        headerLeft: () => <CustomBackButton navigation={navigation} />,
      })} />
      <Stack.Screen name='(personalPages)/settings' options={({ navigation }) => ({
        headerShown: true,
        title: 'Settings',
        headerTitleAlign: 'center',
        headerLeft: () => <CustomBackButton navigation={navigation} />,
      })} />
      <Stack.Screen name='(personalPages)/orders'
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Orders',
          headerTitleAlign: 'center',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })} />
      {/* Personal Information End */}

      {/* Offers */}
      <Stack.Screen
        name="(offersPages)/offers"
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Offers',
          headerTitleAlign: 'center',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })}
      />
      {/* Offers */}


    </Stack>
  )
}