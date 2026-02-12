import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, CheckCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function Step6PhotoUpload({ data, onNext, onBack, isLast, isSaving }) {
    const [photos, setPhotos] = useState([
        { id: 1, url: data.photo1 || null, uploading: false, isPrimary: true },
        { id: 2, url: data.photo2 || null, uploading: false, isPrimary: false },
        { id: 3, url: data.photo3 || null, uploading: false, isPrimary: false },
        { id: 4, url: data.photo4 || null, uploading: false, isPrimary: false },
    ]);

    const uploadToCloudinary = async (uri) => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            });
            formData.append('upload_preset', 'shivbandhan');
            formData.append('cloud_name', 'dqfum2awz');

            const response = await fetch(
                'https://api.cloudinary.com/v1_1/dqfum2awz/image/upload',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw error;
        }
    };

    const pickImage = async (photoId) => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 5],
                quality: 0.8,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;

                // Show loading state
                setPhotos(prev => prev.map(p =>
                    p.id === photoId ? { ...p, uploading: true } : p
                ));

                // Upload to Cloudinary
                const cloudinaryUrl = await uploadToCloudinary(uri);

                // Update photos state
                setPhotos(prev => prev.map(p =>
                    p.id === photoId ? { ...p, url: cloudinaryUrl, uploading: false } : p
                ));

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        } catch (error) {
            console.error('Photo upload error:', error);
            alert('Failed to upload photo. Please try again.');
            setPhotos(prev => prev.map(p =>
                p.id === photoId ? { ...p, uploading: false } : p
            ));
        }
    };

    const deletePhoto = (photoId) => {
        setPhotos(prev => prev.map(p =>
            p.id === photoId ? { ...p, url: null } : p
        ));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleComplete = () => {
        const photoData = {
            photos: photos.filter(p => p.url).map(p => p.url),
            profilePhoto: photos.find(p => p.isPrimary)?.url || photos.find(p => p.url)?.url || null,
        };
        onNext(photoData);
    };

    const hasAtLeastOnePhoto = photos.some(p => p.url);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.stepTitle}>Add Your Photos</Text>
                <Text style={styles.stepSubtitle}>
                    Upload at least one photo to complete your profile
                </Text>

                {/* Photo Grid */}
                <View style={styles.photosGrid}>
                    {photos.map((photo) => (
                        <View key={photo.id} style={styles.photoBoxContainer}>
                            <TouchableOpacity
                                style={styles.photoBox}
                                onPress={() => pickImage(photo.id)}
                                disabled={photo.uploading}
                            >
                                {photo.uploading ? (
                                    <ActivityIndicator size="large" color={Colors.primary} />
                                ) : photo.url ? (
                                    <>
                                        <Image source={{ uri: photo.url }} style={styles.photo} />
                                        {photo.isPrimary && (
                                            <View style={styles.primaryBadge}>
                                                <CheckCircle size={16} color="white" />
                                                <Text style={styles.primaryText}>Primary</Text>
                                            </View>
                                        )}
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => deletePhoto(photo.id)}
                                        >
                                            <X size={16} color="white" />
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <View style={styles.photoPlaceholder}>
                                        <Camera size={32} color={Colors.primary} />
                                        <Text style={styles.photoPlaceholderText}>
                                            {photo.id === 1 ? 'Primary Photo' : `Photo ${photo.id}`}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        • First photo will be your primary profile photo{'\n'}
                        • Upload clear, recent photos{'\n'}
                        • Photos should show your face clearly{'\n'}
                        • Minimum 1 photo required
                    </Text>
                </View>

                {/* Navigation Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.completeButton, !hasAtLeastOnePhoto && styles.disabledButton]}
                        onPress={handleComplete}
                        disabled={!hasAtLeastOnePhoto || isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.completeButtonText}>Complete Profile</Text>
                        )}
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
    photosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        marginBottom: 20,
    },
    photoBoxContainer: {
        width: (width - 60) / 2,
    },
    photoBox: {
        width: '100%',
        height: (width - 60) / 2 * 1.3,
        backgroundColor: Colors.borderLight,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: Colors.borderLight,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        alignItems: 'center',
        gap: 10,
    },
    photoPlaceholderText: {
        fontSize: 12,
        color: Colors.gray,
        fontFamily: 'SpaceMono',
        textAlign: 'center',
    },
    primaryBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: Colors.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    primaryText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono',
    },
    deleteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: Colors.danger,
        padding: 6,
        borderRadius: 15,
    },
    infoBox: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    infoText: {
        fontSize: 13,
        color: Colors.textSecondary,
        lineHeight: 20,
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
    completeButton: {
        flex: 2,
        backgroundColor: Colors.success,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: Colors.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: Colors.gray,
        opacity: 0.5,
    },
    completeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono',
    },
});
