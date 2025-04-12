import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Animatable from "react-native-animatable";
import { useMyContext } from "../../components/provider/ContextApi";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignIn from "./GoogleSignIn";


const SignUp = () => {

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useMyContext();
  const [showPassword, setShowPassword] = useState(false);


  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "userName":
        if (!value.trim()) error = "Full name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8) error = "Password must be at least 8 characters";
        else if (!/[A-Z]/.test(value)) error = "Password needs at least one uppercase letter";
        else if (!/[a-z]/.test(value)) error = "Password needs at least one lowercase letter";
        else if (!/\d/.test(value)) error = "Password needs at least one number";
        else if (!/[!@#$%^&*]/.test(value)) error = "Password needs at least one special character";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "Passwords don't match";
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const fetchUserSignup = async () => {
    setIsLoading(true);
    try {
      const isValid = validateForm();
      if (!isValid) return;

      const success = await signup(
        formData.userName,
        formData.email,
        formData.password
      );

      if (success) {
        router.push({
          pathname: "/otpVerification",
          params: {
            email: encodeURIComponent(formData.email),
            userName: encodeURIComponent(formData.userName),
            password: encodeURIComponent(formData.password)
          }
        });
      } else {
        Alert.alert("Error", "Failed to sign up. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidations = [
    { text: "At least 8 characters", check: formData.password.length >= 8 },
    { text: "At least one uppercase letter", check: /[A-Z]/.test(formData.password) },
    { text: "At least one lowercase letter", check: /[a-z]/.test(formData.password) },
    { text: "At least one number", check: /\d/.test(formData.password) },
    { text: "At least one special character (!@#$%^&*)", check: /[!@#$%^&*]/.test(formData.password) },
    { text: "Passwords match", check: formData.password && formData.password === formData.confirmPassword },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#00B6F1" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topLayer}>
          <TouchableOpacity
            onPress={() => router.push("(auth)")}
            style={styles.backBtn}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Animatable.View
          duration={3000}
          animation="bounceInUp"
          style={styles.form}
        >
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/ADStore.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.heading}>Create an Account</Text>
          <Text style={styles.subText}>Please enter your details to sign up</Text>

          {/* Full Name Input */}
          <TextInput
            style={[styles.input, errors.userName && styles.errorInput]}
            placeholder="Full Name"
            value={formData.userName}
            onChangeText={(text) => handleChange("userName", text)}
            onBlur={() => {
              const error = validateField("userName", formData.userName);
              if (error) setErrors(prev => ({ ...prev, userName: error }));
            }}
          />
          {errors.userName && <Text style={styles.errorText}>{errors.userName}</Text>}

          {/* Email Input */}
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            onBlur={() => {
              const error = validateField("email", formData.email);
              if (error) setErrors(prev => ({ ...prev, email: error }));
            }}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Password Input */}
          <TextInput
            style={[styles.input, errors.password && styles.errorInput]}
            placeholder="Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            onBlur={() => {
              const error = validateField("password", formData.password);
              if (error) setErrors(prev => ({ ...prev, password: error }));
            }}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Confirm Password Input */}

          <View style={styles.inputContainer}>

            <TextInput
              style={[styles.inputconfirm, errors.confirmPassword && styles.errorInput]}
              placeholder="Confirm Password"
              secureTextEntry={!showPassword}
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
              onBlur={() => {
                const error = validateField("confirmPassword", formData.confirmPassword);
                if (error) setErrors(prev => ({ ...prev, confirmPassword: error }));
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" style={{ position: 'absolute', right: 14, top: 14 }} />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          {/* Password Requirements */}
          <View style={styles.validationContainer}>
            {passwordValidations.map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.passwordCondition,
                  { color: item.check ? "green" : "#666" }
                ]}
              >
                {item.check ? (
                  <AntDesign name="check" size={14} color="green" />
                ) : (
                  <AntDesign name="close" size={14} color="#666" />
                )} {item.text}
              </Text>
            ))}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.button,
              (Object.keys(errors).length > 0 || isLoading) && styles.disabledButton
            ]}
            onPress={fetchUserSignup}
            // disabled={Object.keys(errors).length > 0 || isLoading}
            disabled={
              isLoading ||
              !formData.userName ||
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword ||
              !passwordValidations.every(item => item.check)
            }
          >
            <LinearGradient
              colors={["#002B63", "#00B6F1"]}
              style={styles.continueButton}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* GoogleSignIn*/}
          {/* <GoogleSignIn /> */}

          {/* Already Have an Account? */}
          <View style={styles.bottomLayer}>
            <Text style={styles.guestText}>Already have an account?</Text>
            <TouchableOpacity style={styles.guestWrapper} onPress={() => { router.push('/SignIn') }}>
              <Text style={{ color: '#00B6F1', fontWeight: 'bold', fontSize: 16, }}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00B6F1",
    justifyContent: "center"
  },
  topLayer: {
    padding: 20
  },
  backBtn: {
    padding: 10
  },
  form: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10
  },
  header: {
    alignItems: "center",
    marginBottom: 0
  },
  logo: {
    width: 200,
    height: 140
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#051937"
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    color: "gray",
    marginBottom: 10
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 50,
    padding: 15,
    marginBottom: 10,
    fontSize: 16
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red"
  },
  validationContainer: {
    marginVertical: 10,
    paddingHorizontal: 10
  },
  passwordCondition: {
    fontSize: 12,
    marginVertical: 2,
    flexDirection: "row",
    alignItems: "center"
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 50,
    height: 52,
    marginBottom: 10,
    position: 'relative',

  },
  inputconfirm: {
    fontSize: 16,
    paddingHorizontal: 12,
    flex: 1,

  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 15,
    marginBottom: 5
  },
  button: {
    borderRadius: 50,
    marginTop: 10,
    overflow: "hidden"
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  disabledButton: {
    opacity: 0.6
  },
  bottomLayer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
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

export default SignUp;