import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox } from 'react-native-paper';
import { router } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { useMyContext } from '../../components/provider/ContextApi';
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoogleSignIn from "./GoogleSignIn";

const confirmEmail = () => {

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");


  const validateEmail = (text) => {
    setEmail(text);
    if (!text.includes("@") || !text.includes(".")) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };



  const handleContinue = () => {
    if (emailError || !email) {
      Alert.alert("Invalid Email", "Please enter a valid email before continuing.");
      return;
    }

    // Simulate OTP send and navigate to OTP screen
    router.push({
      pathname: "/otpVerificationPass",
      params: { email: email }, // Pass email to the next screen
    });
  };

  const isButtonDisabled = !email || !!emailError;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#00B6F1" />
      {/* Header with Logo */}
      <View style={styles.topLayer}>
        <TouchableOpacity onPress={() => router.push('(auth)')} style={styles.backBtn}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpContainer}>
          <Text style={styles.helpText}>Need help?</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <Animatable.View duration={3000} animation='bounceInUp' style={styles.form}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/ADStore.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.heading}>Forgot Password</Text>
        <Text style={styles.subText}>
          Please enter your email to reset password
        </Text>



        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={validateEmail}
            autoCapitalize ="none"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {/* Continue Button */}
        {/* <TouchableOpacity
          style={[
            styles.button,
              styles.disabledButton,
          ]}
          onPress={fetchUserLogin}
          // disabled={isButtonDisabled}
        > */}

        <TouchableOpacity
          onPress={handleContinue}
          style={[styles.button, isButtonDisabled && styles.disabledButton]}
          disabled={isButtonDisabled}
        >
          <LinearGradient
            colors={['#002B63', '#00B6F1']}
            start={[0, 0]}
            end={[1, 0]}
            style={styles.continueButton}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* GoogleSignIn
        <GoogleSignIn />

        {/* Guest Mode Button 
        <View style={styles.bottomLayer}>
          <TouchableOpacity style={styles.guestWrapper} onPress={() => { router.push('/signup') }}>
            <Text style={styles.guestText}>
              Don't have an account? <Text style={{ color: '#002B63' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View> */}
      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00B6F1",
    justifyContent: "center",
  },
  topLayer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  backBtn: {
    padding: 10,
  },
  helpContainer: {
    padding: 10,
  },
  helpText: {
    fontSize: 16,
    color: "#ffff",
    fontWeight: "bold",
  },
  header: {
    alignItems: "center",
    marginTop: -20,
  },
  logo: {
    width: 200,
    height: 140,
  },
  form: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    padding: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 10,
    elevation: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#051937",
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    color: "gray",
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 50,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: "#00B6F1",
    fontWeight: "bold",
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
    marginLeft: 10,
  },
  link: {
    color: "steelblue",
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    borderRadius: 50,
    overflow: "hidden",
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
  bottomLayer: {
    marginTop: 20,
    alignItems: "center",
  },
  guestWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  guestText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#051937",
  },
});

export default confirmEmail;