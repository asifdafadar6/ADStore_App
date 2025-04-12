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

const resetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = () => {
    setIsLoading(true);
    const isValid = validateForm();
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Password Reset Successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/index")
        }
      ]);
    }, 1500);
  };

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
            onPress={() => router.push("/OtpVerification")} 
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
          
          <Text style={styles.heading}>Reset Password</Text>
          <Text style={styles.subText}>Please enter a new password</Text>

          {/* Password Input */}
          <TextInput
            style={[styles.input, errors.password && styles.errorInput]}
            placeholder="New Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Confirm Password Input */}
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.errorInput]}
            placeholder="Confirm Password"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          {/* Reset Password Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <LinearGradient 
              colors={["#002B63", "#00B6F1"]} 
              style={styles.continueButton}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Reset Password</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
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
  }
});

export default resetPassword;