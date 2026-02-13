import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Heart, Calendar, GraduationCap, Shield } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function Step5PartnerPreferences({ data, onNext, onBack }) {
    const [formData, setFormData] = useState({
        preferredAgeMin: data.preferredAgeMin || '',
        preferredAgeMax: data.preferredAgeMax || '',
        preferredCaste: data.preferredCaste || '',
        preferredEducation: data.preferredEducation || '',
        preferredOccupation: data.preferredOccupation || '',
        preferredMaritalStatus: data.preferredMaritalStatus || '',
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        onNext(formData);
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.stepTitle}>Partner Preferences</Text>
                <Text style={styles.stepSubtitle}>What are you looking for?</Text>

                {/* Preferred Age Range */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preferred Age Range</Text>
                    <View style={styles.rowInputs}>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Calendar size={20} color={Colors.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={formData.preferredAgeMin}
                                onChangeText={(val) => handleChange('preferredAgeMin', val)}
                                placeholder="Min"
                                placeholderTextColor={Colors.gray}
                                keyboardType="numeric"
                            />
                        </View>
                        <Text style={styles.toText}>to</Text>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <TextInput
                                style={styles.input}
                                value={formData.preferredAgeMax}
                                onChangeText={(val) => handleChange('preferredAgeMax', val)}
                                placeholder="Max"
                                placeholderTextColor={Colors.gray}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                {/* Preferred Caste */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preferred Caste</Text>
                    <View style={styles.inputContainer}>
                        <Shield size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.preferredCaste}
                            onChangeText={(val) => handleChange('preferredCaste', val)}
                            placeholder="Enter preferred caste (or 'Any')"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Preferred Education */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preferred Education</Text>
                    <View style={styles.inputContainer}>
                        <GraduationCap size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.preferredEducation}
                            onChangeText={(val) => handleChange('preferredEducation', val)}
                            placeholder="e.g., Graduate, Post-Graduate"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Preferred Occupation */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preferred Occupation</Text>
                    <View style={styles.inputContainer}>
                        <Heart size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.preferredOccupation}
                            onChangeText={(val) => handleChange('preferredOccupation', val)}
                            placeholder="e.g., Engineer, Doctor, Any"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Preferred Marital Status */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preferred Marital Status</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.preferredMaritalStatus}
                            onValueChange={(val) => handleChange('preferredMaritalStatus', val)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Preference" value="" />
                            <Picker.Item label="Unmarried" value="Unmarried" />
                            <Picker.Item label="Divorced" value="Divorced" />
                            <Picker.Item label="Widowed" value="Widowed" />
                            <Picker.Item label="Any" value="Any" />
                        </Picker>
                    </View>
                </View>

                {/* Navigation Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 5,
        
    },
    stepSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 25,
        
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
        
    },
    rowInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    toText: {
        fontSize: 14,
        color: Colors.textSecondary,
        
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 12,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        height: 50,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
        
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    picker: {
        height: 50,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    backButton: {
        flex: 1,
        backgroundColor: Colors.borderLight,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    backButtonText: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        
    },
    nextButton: {
        flex: 2,
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        
    },
});
