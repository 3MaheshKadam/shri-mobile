import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

export default function ProfileSetupLayout() {
    return (
        <View style={styles.container}>
            {/* Shared Background Pattern */}
            <View style={styles.mandalaTopLeft} />
            <View style={styles.mandalaBottomRight} />

            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="step2" />
            </Stack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    mandalaTopLeft: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        borderWidth: 1,
        borderColor: Colors.primaryLight,
        opacity: 0.2,
    },
    mandalaBottomRight: {
        position: 'absolute',
        bottom: -50,
        right: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 1,
        borderColor: Colors.secondaryLight,
        opacity: 0.2,
    },
});
