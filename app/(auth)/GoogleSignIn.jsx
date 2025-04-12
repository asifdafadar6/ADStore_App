import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { FontAwesome } from "@expo/vector-icons";

export default function GoogleSignIn() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      setLoading(true);
      fetchUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      setUserInfo(user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4285F4" />
      ) : userInfo ? (
        <View style={styles.userContainer}>
          <Image source={{ uri: userInfo.picture }} style={styles.userImage} />
          <Text style={styles.welcomeText}>Welcome, {userInfo.name}!</Text>
        </View>
      ) : (
        // <TouchableOpacity onPress={() => promptAsync()} style={styles.button}>
        //   <FontAwesome name="google" size={24} color="white" />
        //   <Text style={styles.buttonText}>Sign in with Google</Text>
        // </TouchableOpacity>

        <TouchableOpacity onPress={() => promptAsync()} style={styles.googleButton}>
          <Image source={require('../../assets/images/Google.png')} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>


      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  userContainer: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  // Google Buttons
  googleButton: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: "#BDDDE4",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#00B6F1",
    // shadowColor: "#00B6F1",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // elevation: 5,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  googleButtonText: {
    color: "#002B63",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
