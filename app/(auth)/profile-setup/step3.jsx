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
import { GraduationCap, Briefcase, DollarSign, Building } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function Step3EducationCareer({ data, onNext, onBack }) {
    const [formData, setFormData] = useState({
        education: data.education || '',
        fieldOfStudy: data.fieldOfStudy || '',
        college: data.college || '',
        occupation: data.occupation || '',
        company: data.company || '',
        income: data.income || '',
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
                <Text style={styles.stepTitle}>Education & Career</Text>
                <Text style={styles.stepSubtitle}>Your professional background</Text>

                {/* Education */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Education</Text>
                    <View style={styles.inputContainer}>
                        <GraduationCap size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.education}
                            onChangeText={(val) => handleChange('education', val)}
                            placeholder="e.g., Bachelor's, Master's"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Field of Study */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Field of Study</Text>
                    <View style={styles.inputContainer}>
                        <GraduationCap size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.fieldOfStudy}
                            onChangeText={(val) => handleChange('fieldOfStudy', val)}
                            placeholder="e.g., Computer Science, Medicine"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* College */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>College/University</Text>
                    <View style={styles.inputContainer}>
                        <Building size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.college}
                            onChangeText={(val) => handleChange('college', val)}
                            placeholder="Enter college name"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Occupation */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Occupation</Text>
                    <View style={styles.inputContainer}>
                        <Briefcase size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.occupation}
                            onChangeText={(val) => handleChange('occupation', val)}
                            placeholder="e.g., Software Engineer, Doctor"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Company */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Company/Organization</Text>
                    <View style={styles.inputContainer}>
                        <Building size={20} color={Colors.gray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.company}
                            onChangeText={(val) => handleChange('company', val)}
                            placeholder="Enter company name"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                {/* Income */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Annual Income</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.income}
                            onValueChange={(val) => handleChange('income', val)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Income Range" value="" />
                            <Picker.Item label="0-5 LPA" value="0-5 LPA" />
                            <Picker.Item label="5-10 LPA" value="5-10 LPA" />
                            <Picker.Item label="10-20 LPA" value="10-20 LPA" />
                            <Picker.Item label="20-30 LPA" value="20-30 LPA" />
                            <Picker.Item label="30+ LPA" value="30+ LPA" />
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
