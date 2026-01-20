import { Stack } from 'expo-router';
import { ImageBackground, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
    return (
        <ImageBackground
            source={require('../../assets/bgmali.png')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                <StatusBar style="light" />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: 'transparent' },
                        animation: 'fade',
                    }}
                >
                    <Stack.Screen name="login" />
                    <Stack.Screen name="register" />
                </Stack>
            </View>
        </ImageBackground>
    );
}
