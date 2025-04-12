import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { useMyContext } from '../provider/ContextApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen() {
  const { user, setUser } = useMyContext();
  const [initialized, setInitialized] = useState(false);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userData = await AsyncStorage.getItem("userData");
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setInitialized(true);
      }
    };

    checkAuthState();
  }, []);

  const handleContinue = () => {
    if (!initialized) return;
    router.replace(user ? "(drawer)" : "(auth)");
  };

  // Show loading state if not initialized yet
  if (!initialized) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="steelblue" />
      
      {/* Image Section */}
      <View style={[styles.imageContainer, { height: height * 0.6 }]}>
        <Animatable.Image
          animation="zoomInUp" 
          delay={1000} 
          duration={3000}
          source={require('../../assets/images/welcomeImage2.png')}
          style={[styles.image, { width: width }]}
          resizeMode="contain" 
        />
      </View>

      {/* Text Section */}
      <View style={styles.bottomDrawer}>
        <View style={styles.textContainer}>
          <Animatable.Text 
            animation="bounceInDown" 
            duration={2000} 
            style={styles.title}>
            Elevating Comfort, One Chair at a Time
          </Animatable.Text>
          <Animatable.Text 
            animation="bounceInUp" 
            duration={2000} 
            style={styles.subtitle}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </Animatable.Text>
        </View>

        {/* Navigation Section */}
        <Animatable.View 
          animation="zoomInUp" 
          delay={2000} 
          duration={2000} 
          style={styles.buttonWrapper}
        >
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleContinue}
          >
            <AntDesign name="arrowright" size={24} color="#ffff" />
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'steelblue',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  image: {
    alignSelf: 'center',
    height: '95%',
    marginTop: 50
  },
  textContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  bottomDrawer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    borderWidth: 2,
    borderColor: 'steelblue',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    zIndex: 10,
    backgroundColor: '#FFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: 'steelblue',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});
