import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../constants/Colors';
import { Calendar, Clock, MapPin, User, Users } from 'lucide-react-native';

export default function PersonalInfo() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        birthTime: '',
        birthLocation: '',
        fatherName: '',
        motherName: '',
    });

    const handleNext = () => {
        // Basic validation could go here
        router.push('/(auth)/profile-setup/step2');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.stepIndicator}>
                        <View style={[styles.stepDot, styles.activeStep]} />
                        <View style={styles.stepLine} />
                        <View style={[styles.stepDot, styles.inactiveStep]} />
                    </View>
                    <Text style={styles.title}>Information</Text>
                    <Text style={styles.subtitle}>Let's start with your basic details</Text>
                </View>

                <View style={styles.form}>
                    {/* Full Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <View style={styles.inputContainer}>
                            <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                                placeholderTextColor={Colors.gray}
                            />
                        </View>
                    </View>

                    {/* DOB */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date of Birth *</Text>
                        <View style={styles.inputContainer}>
                            <Calendar size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="DD/MM/YYYY"
                                value={formData.dob}
                                onChangeText={(text) => setFormData({ ...formData, dob: text })}
                                placeholderTextColor={Colors.gray}
                            />
                        </View>
                    </View>

                    {/* Birth Time */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Birth Time *</Text>
                        <View style={styles.inputContainer}>
                            <Clock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 10:30 AM"
                                value={formData.birthTime}
                                onChangeText={(text) => setFormData({ ...formData, birthTime: text })}
                                placeholderTextColor={Colors.gray}
                            />
                        </View>
                    </View>

                    {/* Birth Location */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Birth Location *</Text>
                        <View style={styles.inputContainer}>
                            <MapPin size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="City, State"
                                value={formData.birthLocation}
                                onChangeText={(text) => setFormData({ ...formData, birthLocation: text })}
                                placeholderTextColor={Colors.gray}
                            />
                        </View>
                    </View>

                    {/* Father Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Father Name</Text>
                        <View style={styles.inputContainer}>
                            <Users size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter father's name"
                                value={formData.fatherName}
                                onChangeText={(text) => setFormData({ ...formData, fatherName: text })}
                                placeholderTextColor={Colors.gray}
                            />
                        </View>
                    </View>

                    {/* Mother Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mother Name</Text>
                        <View style={styles.inputContainer}>
                            <Users size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter mother's name"
                                value={formData.motherName}
                                onChangeText={(text) => setFormData({ ...formData, motherName: text })}
                                placeholderTextColor={Colors.gray}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <LinearGradient
                            colors={[Colors.primary, Colors.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradient}
                        >
                            <Text style={styles.buttonText}>Next</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 12,
        backgroundColor: Colors.white,
        paddingHorizontal: 12,
        height: 50,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
        fontFamily: 'SpaceMono',
        height: '100%',
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
