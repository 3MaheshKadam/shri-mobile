import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { User, Users, Home, MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function Step4FamilyDetails({ data, onNext, onBack }) {
    const [formData, setFormData] = useState({
        fatherName: data.fatherName || '',
        motherName: data.motherName || '',
        brothers: data.brothers || '',
        sisters: data.sisters || '',
        nativeCity: data.nativeCity || '',
        currentCity: data.currentCity || '',
        familyWealth: data.familyWealth || '',
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
                <Text style={styles.stepTitle}>Family Details</Text>
                <Text style={styles.stepSubtitle}>Tell us about your family</Text>

                {/* Father's Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Father's Name</Text>
                    <View style={styles.inputContainer}>
                        <User size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.fatherName}
                            onChangeText={(val) => handleChange('fatherName', val)}
                            placeholder="Enter father's name"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Mother's Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mother's Name</Text>
                    <View style={styles.inputContainer}>
                        <User size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.motherName}
                            onChangeText={(val) => handleChange('motherName', val)}
                            placeholder="Enter mother's name"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Brothers */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Number of Brothers</Text>
                    <View style={styles.inputContainer}>
                        <Users size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.brothers}
                            onChangeText={(val) => handleChange('brothers', val)}
                            placeholder="e.g., 0, 1, 2"
                            placeholderTextColor={Colors.gray}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Sisters */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Number of Sisters</Text>
                    <View style={styles.inputContainer}>
                        <Users size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.sisters}
                            onChangeText={(val) => handleChange('sisters', val)}
                            placeholder="e.g., 0, 1, 2"
                            placeholderTextColor={Colors.gray}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Native City */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Native City</Text>
                    <View style={styles.inputContainer}>
                        <Home size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.nativeCity}
                            onChangeText={(val) => handleChange('nativeCity', val)}
                            placeholder="Enter native city"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Current City */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Current City</Text>
                    <View style={styles.inputContainer}>
                        <MapPin size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.currentCity}
                            onChangeText={(val) => handleChange('currentCity', val)}
                            placeholder="Enter current city"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Family Wealth */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Family Wealth (Optional)</Text>
                    <View style={styles.inputContainer}>
                        <Home size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.familyWealth}
                            onChangeText={(val) => handleChange('familyWealth', val)}
                            placeholder="e.g., Middle Class, Upper Class"
                            placeholderTextColor={Colors.gray}
                        />
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
        fontFamily: 'SpaceMono',
    },
    stepSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 25,
        fontFamily: 'SpaceMono',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
        fontFamily: 'SpaceMono',
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
        fontFamily: 'SpaceMono',
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
        fontFamily: 'SpaceMono',
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
        fontFamily: 'SpaceMono',
    },
});
