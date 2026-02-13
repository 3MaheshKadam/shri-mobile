import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    Alert,
    Modal
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Heart, MapPin, Briefcase, GraduationCap, Calendar, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { sendInterest } from '@/utils/api';
import { useSession } from '@/context/SessionContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ProfileDetail() {
    const { id } = useLocalSearchParams();
    const { user } = useSession();
    const insets = useSafeAreaInsets();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sendingInterest, setSendingInterest] = useState(false);
    const [showImageViewer, setShowImageViewer] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://192.168.1.23:3000/api/users/${id}`);
            const data = await response.json();

            if (data.success) {
                setProfile(data.user);
            } else {
                Alert.alert('Error', 'Failed to load profile');
                router.back();
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            Alert.alert('Error', 'Failed to load profile');
            router.back();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendInterest = async () => {
        try {
            setSendingInterest(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            const response = await sendInterest(id, user?.id);

            if (response.success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert("Success", "Interest sent successfully!");
            } else {
                Alert.alert("Error", response.message || "Failed to send interest");
            }
        } catch (error) {
            console.error("Send interest error:", error);
            Alert.alert("Error", error.message || "Failed to send interest");
        } finally {
            setSendingInterest(false);
        }
    };

    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Profile Image */}
                <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={() => setShowImageViewer(true)}
                    activeOpacity={0.9}
                >
                    <Image
                        source={{ uri: profile.profilePhoto || 'https://via.placeholder.com/400' }}
                        style={styles.profileImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.imageGradient}
                    />
                    <View style={styles.imageOverlay}>
                        <Text style={styles.profileName}>{profile.name}</Text>
                        <Text style={styles.profileAge}>{calculateAge(profile.dob)} years</Text>
                    </View>
                </TouchableOpacity>

                {/* Basic Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>

                    <InfoRow icon={MapPin} label="Location" value={profile.currentCity || 'Not specified'} />
                    <InfoRow icon={Calendar} label="Age" value={`${calculateAge(profile.dob)} years`} />
                    <InfoRow icon={GraduationCap} label="Education" value={profile.education || 'Not specified'} />
                    <InfoRow icon={Briefcase} label="Occupation" value={profile.occupation || 'Not specified'} />
                    {profile.height && <InfoRow label="Height" value={profile.height} />}
                    {profile.maritalStatus && <InfoRow label="Marital Status" value={profile.maritalStatus} />}
                </View>

                {/* Professional Details */}
                {(profile.company || profile.income) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Details</Text>
                        {profile.company && <InfoRow label="Company" value={profile.company} />}
                        {profile.income && <InfoRow label="Income" value={profile.income} />}
                    </View>
                )}

                {/* Family Details */}
                {(profile.fatherName || profile.mother) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Family Details</Text>
                        {profile.fatherName && <InfoRow label="Father's Name" value={profile.fatherName} />}
                        {profile.mother && <InfoRow label="Mother's Name" value={profile.mother} />}
                        {profile.brothers !== undefined && <InfoRow label="Brothers" value={`${profile.brothers}`} />}
                        {profile.sisters !== undefined && <InfoRow label="Sisters" value={`${profile.sisters}`} />}
                    </View>
                )}

                {/* Religious Details */}
                {(profile.religion || profile.caste) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Religious Details</Text>
                        {profile.religion && <InfoRow label="Religion" value={profile.religion} />}
                        {profile.caste && <InfoRow label="Caste" value={profile.caste} />}
                        {profile.subCaste && <InfoRow label="Sub Caste" value={profile.subCaste} />}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Send Interest Button */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity
                    style={styles.interestButton}
                    onPress={handleSendInterest}
                    disabled={sendingInterest}
                >
                    <LinearGradient
                        colors={[Colors.primary, Colors.secondary]}
                        style={styles.interestGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        {sendingInterest ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <>
                                <Heart size={20} color={Colors.white} />
                                <Text style={styles.interestButtonText}>Send Interest</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Image Viewer Modal */}
            <Modal
                visible={showImageViewer}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowImageViewer(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={() => setShowImageViewer(false)}
                    >
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowImageViewer(false)}
                            >
                                <X size={30} color={Colors.white} />
                            </TouchableOpacity>
                            <Image
                                source={{ uri: profile?.profilePhoto || 'https://via.placeholder.com/400' }}
                                style={styles.fullImage}
                                resizeMode="contain"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const InfoRow = ({ icon: Icon, label, value }) => (
    <View style={styles.infoRow}>
        <View style={styles.infoLeft}>
            {Icon && <Icon size={16} color={Colors.gray} />}
            <Text style={styles.infoLabel}>{label}</Text>
        </View>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: Colors.primary,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
        fontFamily: 'SpaceMono',
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        width: width,
        height: 400,
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    profileName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.white,
        fontFamily: 'SpaceMono',
        marginBottom: 5,
    },
    profileAge: {
        fontSize: 16,
        color: Colors.white,
        fontFamily: 'SpaceMono',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 15,
        fontFamily: 'SpaceMono',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: Colors.gray,
        fontFamily: 'SpaceMono',
    },
    infoValue: {
        fontSize: 14,
        color: Colors.black,
        fontWeight: '600',
        fontFamily: 'SpaceMono',
        flex: 1,
        textAlign: 'right',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    interestButton: {
        borderRadius: 25,
        overflow: 'hidden',
    },
    interestGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    interestButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    fullImage: {
        width: width,
        height: '100%',
    },
});
