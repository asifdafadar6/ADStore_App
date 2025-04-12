import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert,Image } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5, AntDesign, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import axios from "axios";


export default function PersonalInformation() {


  const [userData, setUserData] = useState({ payload: {} });
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    dob: "",
    email: "",
  });

  const fetchUserProfile = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (!storedData) {
        Alert.alert("Error", "User data not found");
        return;
      }
  
      const parsedData = JSON.parse(storedData);
      const userId = parsedData.payload.id;
      
      if (!userId) {
        Alert.alert("Error", "User ID not found");
        return;
      }
  
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(
        `https://ipawnode.apdux.tech/api/viewprofilebyid/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.data.userDetails) {
        const user = response.data.userDetails;
        // Update your state with the fetched data
        setUserData({ payload: user });
        
        // If you want to update the form with address data (taking first address as default)
        const defaultAddress = user.address?.[0] || {};
        
        setForm({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: defaultAddress.mobileNumber || "",
          address: defaultAddress.address || "",
          city: defaultAddress.city || "",
          state: defaultAddress.state || "",
          zip: defaultAddress.pincode || "",
          dob: user.dob || "",
          email: user.email || "",
          location: defaultAddress.location || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to fetch user profile");
    }
  };
  
  // Call this in your useEffect
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserProfile();
    };
    fetchData();
  }, []);

  const saveAddress = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (!storedData) {
        Alert.alert("Error", "User data not found");
        return;
      }
      const parsedData = JSON.parse(storedData);
      const userId = parsedData.payload.id;
      const token = await AsyncStorage.getItem("userToken"); // Added await here
  
      if (!userId) {
        Alert.alert("Error", "User ID not found");
        return;
      }
  
      const addressPayload = {
        address: form.address,
        city: form.city,
        isDefault: "true",
        location: form.location,
        mobileNumber: form.phone,
        pincode: form.zip,
        state: form.state,
      };
  
      const response = await axios.post(
        `https://ipawnode.apdux.tech/api/address/${userId}`,
        addressPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.data.success) {
        Alert.alert("Success", "Address saved successfully!");
        await fetchUserProfile(); // Refresh the data after saving
      } else {
        Alert.alert("Error", response.data.msg || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      Alert.alert("Error", "Failed to save address. Please try again.");
    }
  };

  const updateUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const updatedData = {
        ...parsedData,
        payload: { ...parsedData.payload, ...form },
      };

      await AsyncStorage.setItem("userData", JSON.stringify(updatedData));

      // Update state
      setUserData(updatedData);
      
      // Save address to server
      await saveAddress();
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      <Image
        source={{ uri: userData.payload.profileImage }}
        style={styles.profileImage}
      />
        {/* <MaterialIcons name="account-circle" size={80} color="#EB6A39" /> */}
        <Text style={styles.userName}>Hi, {userData.payload?.userName || userData.payload?.firstName || "Create Your Profile"}</Text>
        <Text style={styles.userEmail}>{userData.payload?.email || "Enter your email"}</Text>
      </View>

      {isEditing ? (
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Enter First Name" value={form.firstName} onChangeText={(text) => setForm({ ...form, firstName: text })} />
          <TextInput style={styles.input} placeholder="Enter Last Name" value={form.lastName} onChangeText={(text) => setForm({ ...form, lastName: text })} />
          <TextInput style={styles.input} placeholder="Enter Phone" keyboardType="numeric" value={form.phone} onChangeText={(text) => setForm({ ...form, phone: text })} />
          <TextInput style={styles.input} placeholder="Enter Address" value={form.address} onChangeText={(text) => setForm({ ...form, address: text })} />
          <TextInput style={styles.input} placeholder="Enter Location" value={form.location} onChangeText={(text) => setForm({ ...form, location: text })} />
          <TextInput style={styles.input} placeholder="Enter City" value={form.city} onChangeText={(text) => setForm({ ...form, city: text })} />
          <TextInput style={styles.input} placeholder="Enter State" value={form.state} onChangeText={(text) => setForm({ ...form, state: text })} />
          <TextInput style={styles.input} placeholder="Enter Zip Code" keyboardType="numeric" value={form.zip} onChangeText={(text) => setForm({ ...form, zip: text })} />
          <TextInput style={styles.input} placeholder="Enter Date of Birth" value={form.dob} onChangeText={(text) => setForm({ ...form, dob: text })} />
          <TouchableOpacity style={styles.button} onPress={updateUserData}>
            <MaterialIcons name="save" size={18} color="#fff" />
            <Text style={styles.buttonText}> Save Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsEditing(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (

        <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color="green" style={styles.icon} />
          <Text style={styles.infoText}> 
            {form.phone || "Add your phone number"}
          </Text>
        </View>
      
        {/* Display the first address if available */}
        {userData.payload?.address?.[0] && (
          <>
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={20} color="red" style={styles.icon}/>
              <Text style={styles.infoText}> 
                {userData.payload.address[0].address || "Add your address"}
              </Text>
            </View>
      
            <View style={styles.infoRow}>
              <MaterialIcons name="location-city" size={24} color="blue" style={styles.icon} />
              <Text style={styles.infoText}> 
                {userData.payload.address[0].city || "Add your city"}
              </Text>
            </View>
      
            <View style={styles.infoRow}>
              <MaterialIcons name="place" size={20} color="purple" style={styles.icon} />
              <Text style={styles.infoText}> 
                {userData.payload.address[0].state || "Add your state"}
              </Text>
            </View>
      
            <View style={styles.infoRow}>
              <FontAwesome5 name="mail-bulk" size={20} color="orange" style={styles.icon} />
              <Text style={styles.infoText}> 
                {userData.payload.address[0].pincode || "Add your zip code"}
              </Text>
            </View>
          </>
        )}
      
        <View style={styles.infoRow}>
          <FontAwesome name="calendar" size={20} color="brown" style={styles.icon} />
          <Text style={styles.infoText}> 
            {form.dob || "Add your date of birth"}
          </Text>
        </View>
      
        <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
          <View style={styles.infoRow}>
            <FontAwesome5 name="user-edit" size={18} color="white" />
            <Text style={styles.buttonText}> Edit Profile </Text>
          </View>
        </TouchableOpacity>
      </View>

      )}

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => { router.replace("(auth)/SignIn") }}>
        <View style={styles.infoRow}>
          <Text style={styles.logoutButtonText}>Logout</Text>
          <AntDesign name="logout" size={18} color="white" />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  header: { alignItems: "center", marginBottom: 20 },
  userName: { fontSize: 24, fontWeight: "bold", color: "#333", marginTop: 10 },
  userEmail: { fontSize: 16, color: "#777", marginTop: 5 },
  infoSection: { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginTop: 10, marginBottom: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4,  },
  infoText: { flex: 1, fontSize: 16, marginLeft: 6, marginTop: 8, marginBottom: 8, color: "#333", },
  icon: { width: 24,  marginRight: 12, },
  button: { backgroundColor: "#EB6A39", padding: 10, borderRadius: 10, alignItems: "center", marginTop: 20, marginBottom: 20, flexDirection: "row", justifyContent: "center" , },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 10, },
  logoutButton: { backgroundColor: "#d9534f", padding: 10, borderRadius: 10, alignItems: "center", marginTop: 10, marginBottom: 30, flexDirection: "row", justifyContent: "center" ,},
  logoutButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold", marginRight: 10, },
  cancelButton: { backgroundColor: "#aaa" },
  form: { backgroundColor: "#fff", padding: 20, borderRadius: 10, marginBottom: 20 },
  input: { borderBottomWidth: 1, borderBottomColor: "#ccc", marginBottom: 15, paddingVertical: 8, fontSize: 16 },
  profileImage:{width:100,height:100}
  
});
