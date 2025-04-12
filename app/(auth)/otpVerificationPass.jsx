import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, KeyboardAvoidingView, Platform
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useMyContext } from '../../components/provider/ContextApi';

const { width } = Dimensions.get('window');

export default function OtpVerification() {



    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(30);
    const [isAutoFilled, setIsAutoFilled] = useState(false);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);


    // Generate OTP on load
    useEffect(() => {
        generateAndFillOtp();
    }, []);

    // Timer for resend OTP
    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [resendTimer]);


    // Generate 6-digit OTP and auto-fill after 3 seconds
    const generateAndFillOtp = () => {
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(randomOtp);
        setResendTimer(30);
        setIsAutoFilled(false);
        setOtp(['', '', '', '', '', '']);

        console.log("Generated OTP:", randomOtp);

        // Simulate OTP delivery delay
        setTimeout(() => {
            const otpArray = randomOtp.split('');
            setOtp(otpArray);
            setIsAutoFilled(true);
        }, 3000);
    };

    // Handle OTP input change
    const handleInputChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        // Move to next input
        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleBackspace = (index) => {
        if (index > 0 && otp[index] === '') {
            inputRefs.current[index - 1]?.focus();
            const updatedOtp = [...otp];
            updatedOtp[index - 1] = '';
            setOtp(updatedOtp);
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = () => {
        const enteredOtp = otp.join('');

        if (enteredOtp.length !== 6) {
            setError("Please enter all 6 digits.");
            return;
        }

        if (enteredOtp === generatedOtp) {
            setError('');
            alert("OTP Verified Successfully!");

            // Delay a little so alert shows up
            setTimeout(() => {
                router.push('/resetPassword');
            }, 1000);


        } else {
            setError("Invalid OTP. Try again.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            {/* Back button */}
            <View style={styles.topLayer}>
                <TouchableOpacity onPress={() => router.push('/confirmEmail')} style={styles.backBtn}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Form */}
            <Animatable.View duration={3000} animation='bounceInDown' style={styles.form}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/images/ADStore.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.heading}>OTP Verification</Text>
                <Text style={styles.subText}>
                    We have sent a code to your Email
                </Text>

                {/* OTP Inputs */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={[
                                styles.otpInput,
                                digit ? styles.otpInputFilled : null,
                            ]}
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={(value) => handleInputChange(value, index)}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace') {
                                    handleBackspace(index);
                                }
                            }}
                        />
                    ))}
                </View>

                {/* Error Message */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Timer and Resend */}
                <Text style={styles.timer}>
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : (
                        <TouchableOpacity onPress={generateAndFillOtp}>
                            <Text style={styles.resendText}>Resend OTP</Text>
                        </TouchableOpacity>
                    )}
                </Text>

                {/* Continue Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleVerifyOtp}
                >
                    <LinearGradient
                        colors={['#002B63', '#00B6F1']}
                        start={[0, 0]}
                        end={[1, 0]}
                        style={styles.continueButton}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animatable.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#00B6F1",
        justifyContent: "center",
    },
    topLayer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingTop: Platform.OS === "ios" ? 50 : 20,
    },
    backBtn: {
        padding: 10,
    },
    form: {
        flex: 1,
        backgroundColor: "white",
        width: "100%",
        padding: 25,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -4 },
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 180,
        height: 140,
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
    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginBottom: 20,
        paddingHorizontal: 20
    },
    otpInput: {
        width: width * 0.13,
        height: width * 0.13,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 12,
        textAlign: "center",
        fontSize: width * 0.06,
        marginHorizontal: 6,
        backgroundColor: "#F0F0F0",
    },
    otpInputFilled: {
        borderColor: "#51C6B7",
        backgroundColor: "#E7F7F4",
    },
    timer: {
        fontSize: width * 0.04,
        color: "#666666",
        marginVertical: 20,
        textAlign: "center",
    },
    resendText: {
        color: "#00B6F1",
        textDecorationLine: "underline",
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
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
});