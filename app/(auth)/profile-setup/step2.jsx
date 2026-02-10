import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../constants/Colors';
import { Picker } from '@react-native-picker/picker'; // Install if missing

export default function SocialInfo() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        caste: '',
        rashi: '',
        constellation: '',
        tribes: '',
    });

    const handleNext = () => {
        // Navigate to Dashboard
        router.replace('/(dashboard)/(tabs)/matches');
    };

    return (
        <View style={styles.container}>
            {/* Background Decor */}
            <View style={styles.mandalaTopRight} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.stepIndicator}>
                        <View style={[styles.stepDot, styles.inactiveStep]} />
                        <View style={[styles.stepLine, styles.activeLine]} />
                        <View style={[styles.stepDot, styles.activeStep]} />
                    </View>
                    <Text style={styles.title}>Information</Text>
                    <Text style={styles.subtitle}>Tell us about your background</Text>
                </View>

                <View style={styles.form}>
                    {/* Caste */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Caste *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.caste}
                                onValueChange={(itemValue) => setFormData({ ...formData, caste: itemValue })}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                            >
                                <Picker.Item label="Select Caste" value="" color={Colors.gray} />
                                <Picker.Item label="Maratha" value="Maratha" />
                                <Picker.Item label="Brahmin" value="Brahmin" />
                                <Picker.Item label="Kunbi" value="Kunbi" />
                                {/* Add more castes */}
                            </Picker>
                        </View>
                    </View>

                    {/* Rashi */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Rashi *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.rashi}
                                onValueChange={(itemValue) => setFormData({ ...formData, rashi: itemValue })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Rashi" value="" color={Colors.gray} />
                                <Picker.Item label="Aries (Mesh)" value="Aries" />
                                <Picker.Item label="Taurus (Vrishabh)" value="Taurus" />
                                <Picker.Item label="Leo (Simha)" value="Leo" />
                                {/* Add more */}
                            </Picker>
                        </View>
                    </View>

                    {/* Constellation */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Constellation *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.constellation}
                                onValueChange={(itemValue) => setFormData({ ...formData, constellation: itemValue })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Constellation" value="" color={Colors.gray} />
                                <Picker.Item label="Ardra" value="Ardra" />
                                <Picker.Item label="Bharani" value="Bharani" />
                                <Picker.Item label="Krittika" value="Krittika" />
                                {/* Add more */}
                            </Picker>
                        </View>
                    </View>

                    {/* Tribes */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tribes (Gotra) *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.tribes}
                                onValueChange={(itemValue) => setFormData({ ...formData, tribes: itemValue })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Tribe" value="" color={Colors.gray} />
                                <Picker.Item label="Kashyapa" value="Kashyapa" />
                                <Picker.Item label="Vashistha" value="Vashistha" />
                                <Picker.Item label="Bharadwaj" value="Bharadwaj" />
                                {/* Add more */}
                            </Picker>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <LinearGradient
                            colors={[Colors.primary, Colors.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradient}
                        >
                            <Text style={styles.buttonText}>Complete Profile</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mandalaTopRight: {
        position: 'absolute',
        top: -150,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: Colors.primaryLight,
        opacity: 0.15,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        fontFamily: 'SpaceMono',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        fontFamily: 'SpaceMono',
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'center'
    },
    stepDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    activeStep: {
        backgroundColor: Colors.primary,
    },
    inactiveStep: {
        backgroundColor: Colors.borderLight,
    },
    stepLine: {
        width: 40,
        height: 2,
        backgroundColor: Colors.borderLight,
        marginHorizontal: 8,
    },
    activeLine: {
        backgroundColor: Colors.primary,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
        fontFamily: 'SpaceMono',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 12,
        backgroundColor: Colors.white,
        overflow: 'hidden', // Required for rounded corners on Android
        height: 55, // Fixed height for consistency
        justifyContent: 'center'
    },
    picker: {
        width: '100%',
        color: Colors.textPrimary,
    },
    pickerItem: {
        fontSize: 16,
        fontFamily: 'SpaceMono'
    },
    button: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 20,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    gradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono',
    },
});
