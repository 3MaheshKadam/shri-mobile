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
import { Calendar, User, Ruler, Weight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function Step1BasicInfo({ data, onNext, isFirst }) {
    const [formData, setFormData] = useState({
        name: data.name || '',
        dob: data.dob || '',
        gender: data.gender || '',
        height: data.height || '',
        weight: data.weight || '',
        maritalStatus: data.maritalStatus || '',
        bloodGroup: data.bloodGroup || '',
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (!formData.name || !formData.gender || !formData.maritalStatus) {
            alert('Please fill all required fields');
            return;
        }
        onNext(formData);
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.stepTitle}>Basic Information</Text>
                <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

                {/* Full Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Full Name <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                        <User size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(val) => handleChange('name', val)}
                            placeholder="Enter your full name"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Date of Birth */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Date of Birth <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                        <Calendar size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.dob}
                            onChangeText={(val) => handleChange('dob', val)}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Gender */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Gender <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.gender}
                            onValueChange={(val) => handleChange('gender', val)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Gender" value="" />
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                        </Picker>
                    </View>
                </View>

                {/* Marital Status */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Marital Status <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.maritalStatus}
                            onValueChange={(val) => handleChange('maritalStatus', val)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Status" value="" />
                            <Picker.Item label="Unmarried" value="Unmarried" />
                            <Picker.Item label="Divorced" value="Divorced" />
                            <Picker.Item label="Widowed" value="Widowed" />
                        </Picker>
                    </View>
                </View>

                {/* Height */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Height</Text>
                    <View style={styles.inputContainer}>
                        <Ruler size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.height}
                            onChangeText={(val) => handleChange('height', val)}
                            placeholder="e.g., 5'8&quot;"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Weight */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Weight (kg)</Text>
                    <View style={styles.inputContainer}>
                        <Weight size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.weight}
                            onChangeText={(val) => handleChange('weight', val)}
                            placeholder="e.g., 70"
                            placeholderTextColor={Colors.gray}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Blood Group */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Blood Group</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.bloodGroup}
                            onValueChange={(val) => handleChange('bloodGroup', val)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Blood Group" value="" />
                            <Picker.Item label="A+" value="A+" />
                            <Picker.Item label="A-" value="A-" />
                            <Picker.Item label="B+" value="B+" />
                            <Picker.Item label="B-" value="B-" />
                            <Picker.Item label="AB+" value="AB+" />
                            <Picker.Item label="AB-" value="AB-" />
                            <Picker.Item label="O+" value="O+" />
                            <Picker.Item label="O-" value="O-" />
                        </Picker>
                    </View>
                </View>

                {/* Next Button */}
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Continue</Text>
                </TouchableOpacity>
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
    required: {
        color: Colors.danger,
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
    nextButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
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
