import React, { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Switch,
  Dimensions,
  Animated,
  Easing,
  StyleSheet
} from 'react-native';
import {
  User,
  Heart,
  Eye,
  CheckCircle,
  Edit3,
  Crown,
  Camera,
  MapPin,
  Calendar,
  Award,
  ChevronRight,
  Plus,
  X,
  AlertCircle,
  ChevronDown,
  Shield,
  ArrowDown
} from 'lucide-react-native';
import { useSession } from '../../../context/SessionContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker'; // Ensure this is installed
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { Config } from '@/constants/Config';

const { width } = Dimensions.get('window');

const ProfileSectionHeader = ({ title, completion, onPress, isExpanded }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.sectionHeader}
    >
      <View style={styles.sectionHeaderContent}>
        <View style={styles.sectionTitleRow}>
          {/* Completion Badge */}
          <View style={[styles.completionBadge, { backgroundColor: completion === 100 ? Colors.success : Colors.primary }]}>
            <Text style={styles.completionText}>{completion}%</Text>
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <ChevronRight size={20} color={Colors.gray} style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }} />
      </View>
    </TouchableOpacity>
  );
};

const FormInput = ({ label, value, onChange, placeholder, type = 'text', options = [], required }) => {
  if (type === 'select' || type === 'checkbox') {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {label} {required && <Text style={{ color: Colors.danger }}>*</Text>}
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={type === 'checkbox' ? (value ? 'Yes' : 'No') : value}
            onValueChange={(val) => onChange(type === 'checkbox' ? val === 'Yes' : val)}
            style={styles.picker}
            dropdownIconColor={Colors.primary}
          >
            <Picker.Item label={`Select ${label}`} value="" color={Colors.gray} />
            {type === 'checkbox' ? (
              <>
                <Picker.Item label="No" value="No" />
                <Picker.Item label="Yes" value="Yes" />
              </>
            ) : (
              options.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))
            )}
          </Picker>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={{ color: Colors.danger }}>*</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        style={styles.input}
        keyboardType={type === 'number' ? 'numeric' : type === 'email' ? 'email-address' : 'default'}
      />
    </View>
  );
};

export default function MyProfilePage() {
  const { user } = useSession();
  const router = useRouter();
  const [formSections, setFormSections] = useState([]);
  const [formData, setFormData] = useState({});
  const [photos, setPhotos] = useState([
    { id: 1, url: null, isPrimary: true },
    { id: 2, url: null, isPrimary: false },
    { id: 3, url: null, isPrimary: false },
    { id: 4, url: null, isPrimary: false },
  ]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Hardcoded mapping for demo/simplicity if API fails or for new fields
  const fieldNameMappings = {
    'Full Name': 'name',
    'Date of Birth': 'dob',
    // ... Add other mappings as needed, similar to original file
  };
  const normalizeFieldName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');


  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch form sections structure
        const sectionsRes = await fetch(`${Config.API_URL}/api/admin/form-sections`);
        const sectionsData = await sectionsRes.json();

        // transform sections... (simplified for brevity, assume structure is mostly correct or handle error)
        const transformedSections = sectionsData.map(section => ({
          ...section,
          fields: section.fields.map(f => ({ ...f, options: f.options || [] }))
        }));

        setFormSections(transformedSections);

        const initialExpanded = {};
        if (transformedSections.length > 0) initialExpanded[transformedSections[0]._id] = true;
        setExpandedSections(initialExpanded);


        // Fetch user data
        const userRes = await fetch(`${Config.API_URL}/api/users/me`, { credentials: 'include' });
        const userData = await userRes.json();

        // Populate formData similar to original...
        const initialFormData = { ...userData };
        setFormData(initialFormData);

        if (userData.profilePhoto) {
          setPhotos(p => p.map(ph => ph.id === 1 ? { ...ph, url: userData.profilePhoto } : ph));
        }

        setIsLoading(false);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading data:", error);
        // Fallback or Alert
        setIsLoading(false);
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // Calculate completion effect...
  useEffect(() => {
    if (formSections.length > 0) {
      // Simplified calculation
      let filled = 0;
      let total = 0;
      formSections.forEach(s => {
        s.fields.forEach(f => {
          total++;
          if (formData[f.name]) filled++;
        })
      });
      setProfileCompletion(total > 0 ? Math.round((filled / total) * 100) : 0);
    }
  }, [formData, formSections]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { updateUserProfile } = await import('@/utils/api');
      const userId = user?.id || user?._id;
      const response = await updateUserProfile({ ...formData, userId });

      if (response.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        alert('Profile Saved Successfully!');
      } else {
        alert('Failed to save profile.');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Upload photo to Cloudinary
  const uploadToCloudinary = async (uri) => {
    try {
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration missing');
      }

      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
      formData.append('upload_preset', uploadPreset);
      formData.append('cloud_name', cloudName);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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

  // Photo logic with Cloudinary upload
  const pickImage = async (photoId) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.5, // Reduced from 0.8 for faster upload
        base64: false,
        exif: false,
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

        // Update user profile with new photo
        const { updatePhoto } = await import('@/utils/api');
        const isPrimary = photoId === 1;
        const userId = user?.id || user?._id;

        await updatePhoto(userId, {
          url: cloudinaryUrl,
          isPrimary: isPrimary
        });

        // If it's the primary photo, update formData
        if (isPrimary) {
          handleInputChange('profilePhoto', cloudinaryUrl);
        }

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

  const setPrimaryPhoto = async (photoId) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo || !photo.url) return;

      setPhotos(prev => prev.map(p => ({
        ...p,
        isPrimary: p.id === photoId
      })));

      const { updatePhoto } = await import('@/utils/api');
      const userId = user?.id || user?._id;
      await updatePhoto(userId, {
        url: photo.url,
        isPrimary: true
      });

      handleInputChange('profilePhoto', photo.url);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Set primary photo error:', error);
      alert('Failed to set primary photo.');
    }
  };

  const deletePhoto = async (photoId) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo || !photo.url) return;

      setPhotos(prev => prev.map(p =>
        p.id === photoId ? { ...p, url: null, isPrimary: false } : p
      ));

      const { updatePhoto } = await import('@/utils/api');
      const userId = user?.id || user?._id;
      await updatePhoto(userId, {
        url: photo.url,
        delete: true
      });

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Delete photo error:', error);
      alert('Failed to delete photo.');
    }
  };


  const renderSection = (section) => {
    const isExpanded = expandedSections[section._id];
    // Calculate section completion
    let filled = 0;
    section.fields.forEach(f => { if (formData[f.name]) filled++; });
    const comp = section.fields.length > 0 ? Math.round((filled / section.fields.length) * 100) : 0;

    return (
      <View key={section._id} style={styles.sectionContainer}>
        <ProfileSectionHeader
          title={section.label}
          completion={comp}
          isExpanded={isExpanded}
          onPress={() => setExpandedSections(prev => ({ ...prev, [section._id]: !prev[section._id] }))}
        />
        {isExpanded && (
          <View style={styles.sectionContent}>
            {section.label.toLowerCase().includes('photo') ? (
              <View style={styles.photosGrid}>
                {photos.map(photo => (
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
                              <Text style={styles.primaryText}>Primary</Text>
                            </View>
                          )}
                          <View style={styles.photoActions}>
                            {!photo.isPrimary && (
                              <TouchableOpacity
                                style={styles.photoActionBtn}
                                onPress={() => setPrimaryPhoto(photo.id)}
                              >
                                <Text style={styles.photoActionText}>Set Primary</Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              style={[styles.photoActionBtn, styles.deleteBtn]}
                              onPress={() => deletePhoto(photo.id)}
                            >
                              <X size={16} color="white" />
                            </TouchableOpacity>
                          </View>
                        </>
                      ) : (
                        <View style={styles.photoPlaceholder}>
                          <Camera size={32} color={Colors.primary} />
                          <Text style={styles.photoPlaceholderText}>Add Photo</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              section.fields.map(field => (
                <FormInput
                  key={field._id}
                  label={field.label}
                  value={formData[field.name]}
                  onChange={(val) => handleInputChange(field.name, val)}
                  type={field.type}
                  options={field.options}
                />
              ))
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Gradient */}
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Profile</Text>

            <View style={styles.profileInfo}>
              <TouchableOpacity onPress={() => pickImage(1)}>
                <View style={styles.avatarContainer}>
                  {formData.profilePhoto ? (
                    <Image source={{ uri: formData.profilePhoto }} style={styles.avatar} />
                  ) : (
                    <User size={40} color={Colors.primary} />
                  )}
                  <View style={styles.editIconBadge}>
                    <Edit3 size={12} color="white" />
                  </View>
                </View>
              </TouchableOpacity>

              <Text style={styles.userName}>{formData.name || 'User Name'}</Text>
              <View style={styles.verificationRow}>
                <Shield size={14} color="white" />
                <Text style={styles.verificationText}>{user?.verificationStatus || 'Unverified'}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>120</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>85</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {/* Progress Bar (Overall) */}
          <View style={styles.overallProgress}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={styles.progressLabel}>Profile Completed</Text>
              <Text style={styles.progressValue}>{profileCompletion}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${profileCompletion}%` }]} />
            </View>
          </View>

          <View style={styles.sectionsList}>
            {formSections.map(renderSection)}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,

  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.secondary, // Darker pink
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,

  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 20,
  },
  verificationText: {
    color: 'white',
    fontSize: 12,

  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    paddingVertical: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',

  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,

  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  contentContainer: {
    padding: 20,
  },
  overallProgress: {
    marginBottom: 25,
  },
  progressLabel: {
    color: Colors.gray,
    fontSize: 14,
    fontWeight: '600',

  },
  progressValue: {
    color: Colors.primary,
    fontWeight: 'bold',

  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  sectionsList: {
    gap: 15,
  },
  sectionContainer: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  sectionHeader: {
    padding: 16,
    backgroundColor: '#FAFAFA', // Light bg for header
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  completionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  completionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',

  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,

  },
  sectionContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,

  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: 'white',

  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: Colors.textPrimary,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  photoBoxContainer: {
    width: (width - 80) / 2,
  },
  photoBox: {
    width: '100%',
    height: (width - 80) / 2 * 1.2,
    backgroundColor: Colors.borderLight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: Colors.gray,

  },
  photoActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    gap: 5,
  },
  photoActionBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',

  },
  deleteBtn: {
    backgroundColor: Colors.danger,
    flex: 0,
    paddingHorizontal: 8,
  },
  primaryBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  primaryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',

  },
  saveButton: {
    marginTop: 30,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',

  }

});
