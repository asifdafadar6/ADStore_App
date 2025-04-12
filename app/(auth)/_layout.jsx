import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown:false}}/>
        <Stack.Screen name='SignIn' options={{headerShown:false}}/>
        <Stack.Screen name='signup' options={{headerShown:false}}/>
        <Stack.Screen name='confirmEmail' options={{headerShown:false}}/>
        <Stack.Screen name='otpVerificationPass' options={{headerShown:false}}/>
        <Stack.Screen name='resetPassword' options={{headerShown:false}}/>
        <Stack.Screen name='otpVerification' options={{headerShown:false}}/>
    </Stack>
  )
}

  // #002B63
  // #00B6F1