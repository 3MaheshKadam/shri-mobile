import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

// Import step components
import Step1BasicInfo from './step1';
import Step2ReligiousInfo from './step2';
import Step3EducationCareer from './step3';
import Step4FamilyDetails from './step4';
import Step5PartnerPreferences from './step5';
import Step6PhotoUpload from './step6';

const { width } = Dimensions.get('window');

const STEPS = [
    { id: 1, title: 'Basic Info', component: Step1BasicInfo },
    { id: 2, title: 'Religious Info', component: Step2ReligiousInfo },
    { id: 3, title: 'Education & Career', component: Step3EducationCareer },
    { id: 4, title: 'Family Details', component: Step4FamilyDetails },
    { id: 5, title: 'Partner Preferences', component: Step5PartnerPreferences },
    { id: 6, title: 'Photos', component: Step6PhotoUpload },
];

export default function ProfileSetup() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const handleNext = (stepData) => {
        setFormData(prev => ({ ...prev, ...stepData }));

        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handleComplete = async () => {
        setIsSaving(true);
        try {
            const { updateUserProfile } = await import('@/utils/api');
            const response = await updateUserProfile(formData);

            if (response.success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                router.replace('/(dashboard)/(tabs)/matches');
            } else {
                alert('Failed to save profile. Please try again.');
            }
        } catch (error) {
            console.error('Profile setup error:', error);
            alert('Error saving profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const CurrentStepComponent = STEPS[currentStep - 1].component;
    const progress = (currentStep / STEPS.length) * 100;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header with Progress */}
            <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Complete Your Profile</Text>
                <Text style={styles.headerSubtitle}>
                    Step {currentStep} of {STEPS.length}
                </Text>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>

                {/* Step Indicators */}
                <View style={styles.stepIndicators}>
                    {STEPS.map((step) => (
                        <View
                            key={step.id}
                            style={[
                                styles.stepDot,
                                step.id === currentStep && styles.stepDotActive,
                                step.id < currentStep && styles.stepDotCompleted,
                            ]}
                        />
                    ))}
                </View>
            </LinearGradient>

            {/* Step Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <CurrentStepComponent
                    data={formData}
                    onNext={handleNext}
                    onBack={handleBack}
                    isFirst={currentStep === 1}
                    isLast={currentStep === STEPS.length}
                    isSaving={isSaving}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 5,
        
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 15,
        
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 4,
    },
    progressText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        
        minWidth: 40,
        textAlign: 'right',
    },
    stepIndicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    stepDotActive: {
        width: 24,
        backgroundColor: 'white',
    },
    stepDotCompleted: {
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
});
