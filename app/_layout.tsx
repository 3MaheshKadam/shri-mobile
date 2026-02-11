import { Stack, SplashScreen, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionProvider } from "../context/SessionContext";
import { View, Text, Dimensions, ActivityIndicator, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Prevent the splash screen from auto-hiding
  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    async function prepare() {
      try {
        // Check if first launch
        const hasLaunched = await AsyncStorage.getItem('HAS_LAUNCHED');
        const userToken = await AsyncStorage.getItem('authToken');

        // Logic: Show splash ONLY if NOT launched before AND NO user session
        // If user has a token, we skip splash to get them to content faster
        // If user has launched before (but logged out), we also skip the long splash

        // Show splash screen for 3 seconds on every launch
        await new Promise(resolve => setTimeout(resolve, 3000));
        // await AsyncStorage.setItem('HAS_LAUNCHED', 'true');

        // If we don't show splash, we just proceed immediately (or minimal load time)

      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const CustomSplashScreen = () => {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFF0F5', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
          <Image
            source={require('../assets/images/flash.png')}
            style={{ width: '80%', height: '80%' }}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  };

  const ShreeKalyanamHeader = () => {
    const router = useRouter();
    return (
      <View>
        {/* Gradient Background - Removed for clearer UI on dashboard */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: Colors.primary }} />

        {/* Single Line Header */}
        <View style={{
          paddingTop: 48,
          paddingBottom: 16,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}>
          {/* Logo */}
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: Colors.white,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
              borderWidth: 1,
              borderColor: `${Colors.white}40`,
            }}
          >
            <Image
              source={require('../assets/images/logo_swans_old.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>

          {/* Name and Tagline */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: Colors.white,
                fontFamily: 'SpaceMono',
                letterSpacing: -0.3,
              }}>
                Shree-Kalyanam
              </Text>
            </View>
          </View>

          {/* Profile Button */}
          <TouchableOpacity
            onPress={() => router.push('/(dashboard)/(tabs)/profile')}
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 20,
            }}
          >
            <User size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Bottom Accent Bar - Lighter gradient */}
        <View style={{ height: 1, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.2)' }} />
      </View>
    );
  };

  if (!appIsReady || !fontsLoaded) {
    return <CustomSplashScreen />;
  }

  return (
    <SessionProvider>
      {/* Removed ImageBackground from here to allow white/clean background on dashboard */}
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Stack screenOptions={{
          header: () => <ShreeKalyanamHeader />,
          headerTransparent: false,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Colors.background },
        }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(dashboard)" />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          <Stack.Screen name="payment-success" options={{ title: 'Payment Success' }} />
          <Stack.Screen name="payment-failure" options={{ title: 'Payment Failed' }} />
          {/* Handle not-found */}
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
      </View>
    </SessionProvider>
  );
}