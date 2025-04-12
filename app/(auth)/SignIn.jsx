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
import { Ionicons } from "@expo/vector-icons";

const SignIn = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useMyContext();
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const validateEmail = (text) => {
    setEmail(text);
    if (!text.includes("@") || !text.includes(".")) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    if (text.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const fetchUserLogin = async () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (emailError || passwordError) {
      return;
    }

    try {
      const success = await login(email, password);
      if (!success) {
        Alert.alert("Login Failed", "Invalid credentials. Please try again.");
        return;
      }
      if (success) {
        router.push("(drawer)");
      } else {
        setError("Failed to login. Please check your credentials.");
        Alert.alert("Failed to login.", "Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    }
  };

  const handleForgotPassword = () => {
    router.push("/otpVerification");
  };

  const handleGuestLogin = async () => {
    try {
      
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("userToken");
      router.replace("(drawer)");
    } catch (error) {
      console.error("Guest Login Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const isButtonDisabled = !isChecked || !email || !password || !!emailError || !!passwordError;

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
        <Text style={styles.heading}>Welcome Here!</Text>
        <Text style={styles.subText}>
          Please enter your email and password to sign in
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={validateEmail}
            autoCapitalize="none"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry={!showPassword}

          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" style={{ top: 14 }} />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>



        {/* Checkbox for Terms & Conditions */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isChecked ? 'checked' : 'unchecked'}
            onPress={() => setIsChecked(!isChecked)}
            color="#00B6F1"
            uncheckedColor="#00B6F1"
          />
          <Text style={styles.checkboxText}>
            I agree to the <Text style={styles.link}>Terms & Conditions</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.button,
            isButtonDisabled && styles.disabledButton,
          ]}
          onPress={fetchUserLogin}
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

        {/* GoogleSignIn*/}
        <GoogleSignIn />

        {/* Guest Mode Button */}
        <View style={styles.bottomLayer}>
          <Text style={styles.guestText}>Don't have an account?</Text>
          <TouchableOpacity style={styles.guestWrapper} onPress={() => { router.push('/signup') }}>
            <Text style={{ color: '#00B6F1', fontWeight: 'bold', fontSize: 16,}}>Sign Up</Text>
          </TouchableOpacity>
        </View>


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
    flexDirection: "row",
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
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    margin: 'auto',
  },
  guestText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#051937",
    marginRight: 10,
  },
});

export default SignIn;