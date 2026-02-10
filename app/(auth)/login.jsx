import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ArrowRight, Phone, Shield, RotateCcw, Edit, Smartphone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/context/SessionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function ShreeKalyanamLogin() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Phone Number, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const { login, user } = useSession();
  const otpInputs = useRef([]);

  useEffect(() => {
    setIsLoaded(true);
    if (user) {
      // Logic to decide where to go.
      // For now, we allow the user to stay here or redirect manually if needed.
    }
  }, [user, router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSendOTP = () => {
    setError('');
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setStep(2);
      setResendTimer(30);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsLoading(false);
    }, 1000);
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    } else if (!value && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    // Static OTP verification
    if (otpString === '123456') {
      const cleanedPhone = phoneNumber.replace(/\s/g, '');
      const fullPhoneNumber = `${countryCode}${cleanedPhone}`;
      const success = await login(fullPhoneNumber);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Proceed to Terms & Conditions step
        setStep(3);
      } else {
        setError('Login failed. Please check your internet connection.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } else {
      // Fallback for demo if API fails
      setError('Invalid OTP');
    }
    setIsLoading(false);
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendTimer(30);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatPhoneDisplay = (phone) => {
    return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  return (
    <View style={styles.container}>
      {/* Mandala Background Pattern */}
      <Image
        source={require('../../assets/images/mandala_design.png')}
        style={styles.mandalaTopRight}
        resizeMode="contain"
      />
      <Image
        source={require('../../assets/images/mandala_design.png')}
        style={styles.mandalaBottomLeft}
        resizeMode="contain"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            {/* Main Couple Image / Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/couple_wedding.png')}
                style={{ width: width * 0.8, height: 300 }}
                resizeMode="contain"
              />
            </View>
          </View>


          <View style={styles.content}>
            <Text style={styles.title}>Let's Sign You In</Text>
            <Text style={styles.subtitle}>Welcome back, you've been missed!</Text>

            {step === 1 ? (
              <View style={styles.form}>
                <Text style={styles.label}>Enter number</Text>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>{countryCode}</Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="98765 43210"
                    placeholderTextColor={Colors.gray}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>

                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}

                {/* Next Button (Pink) */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSendOTP}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                  )}
                </TouchableOpacity>

              </View>
            ) : step === 2 ? (
              <View style={styles.form}>
                <Text style={styles.label}>Verify OTP</Text>
                <Text style={styles.otpSubtitle}>
                  Sent to {countryCode} {formatPhoneDisplay(phoneNumber)}
                </Text>

                <View style={styles.otpInputs}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (otpInputs.current[index] = ref)}
                      style={styles.otpInput}
                      value={digit}
                      onChangeText={(value) => handleOTPChange(index, value)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                    />
                  ))}
                </View>

                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleVerifyOTP}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Verify</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleResendOTP} disabled={resendTimer > 0} style={{ alignSelf: 'center', marginTop: 10 }}>
                  <Text style={{ color: Colors.primary }}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep(1)} style={{ alignSelf: 'center', marginTop: 10 }}>
                  <Text style={{ color: Colors.gray }}>Change Number</Text>
                </TouchableOpacity>
              </View>
            ) : step === 3 ? (
              <View style={styles.termsContainer}>
                <Text style={styles.termsTitle}>Security Terms & Conditions</Text>
                <ScrollView style={styles.termsScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.termsText}>
                    By registering with our Marriage Bureau, you agree to the following Security Terms and Conditions:
                    {'\n\n'}
                    All applicants must provide accurate and verifiable personal information... (Terms content truncated for brevity)
                    {'\n\n'}
                    You are solely responsible for verifying the background...
                    {'\n\n'}
                    By continuing, you confirm you have read and agreed to these terms.
                  </Text>
                </ScrollView>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.push('/(auth)/profile-setup')}
                >
                  <Text style={styles.buttonText}>I Agree & Continue</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mandalaTopRight: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    opacity: 0.15,
    transform: [{ rotate: '45deg' }],
  },
  mandalaBottomLeft: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    opacity: 0.15,
    transform: [{ rotate: '-45deg' }],
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  illustration: {
    width: width * 0.8,
    height: 250,
  },
  content: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'SpaceMono',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  countryCode: {
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    color: Colors.gray,
    fontFamily: 'SpaceMono',
  },
  verticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.borderLight,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'SpaceMono',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: Colors.white,
    color: Colors.primary,
    fontFamily: 'SpaceMono',
  },
  otpSubtitle: {
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  termsContainer: {
    gap: 16,
    height: 400,
  },
  termsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  termsScroll: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  termsText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'SpaceMono',
    textAlign: 'justify',
  }
});