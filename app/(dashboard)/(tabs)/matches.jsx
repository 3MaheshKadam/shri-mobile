import { BlurView } from 'expo-blur';
import React, { useState, useEffect, useMemo, memo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Dimensions,
    Animated,
    StyleSheet,
    Pressable,
    Modal,
    ActivityIndicator,
    Alert
} from 'react-native';
import {
    Heart,
    MapPin,
    GraduationCap,
    Clock,
    Sparkles,
    Filter,
    Search,
    Lock,
    Camera,
    CheckCircle,
    SlidersHorizontal,
    X,
    Briefcase
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '@/context/SessionContext';
import { Config } from '@/constants/Config';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

const maskFirstName = (fullName) => {
    if (!fullName) return '****';
    const names = fullName.split(' ');
    // return names.length > 1 ? `${'*'.repeat(names[0].length)} ${names.slice(1).join(' ')}` : '****';
    // Matches design usually shows full name but blurred if not premium? Let's stick closer to standard behavior.
    return fullName; // For now simplifying
};

const MatchesPage = () => {
    const { user } = useSession();
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const insets = useSafeAreaInsets();

    // Mock Data for UI Dev
    useEffect(() => {
        // In a real scenario, fetch from API. 
        // For now, generating mock data to match the visual design requirements.
        const mockData = Array.from({ length: 10 }).map((_, i) => ({
            _id: `user-${i}`,
            name: i % 2 === 0 ? 'Savita Kedar Chvahan' : 'Isha Gangadhar Fadn...',
            age: 24 + i,
            dob: '13/12/1997',
            time: '09:30 AM',
            location: i % 2 === 0 ? 'Pune' : 'Thane',
            education: i % 2 === 0 ? 'MBA' : 'BSc',
            profilePhoto: `https://randomuser.me/api/portraits/women/${40 + i}.jpg`,
            isVerified: true,
            compatibility: 90 - i * 2,
            isNew: i < 3,
        }));

        setTimeout(() => {
            setMatches(mockData);
            setIsLoading(false);
        }, 1000);
    }, []);


    const MatchCard = memo(({ match }) => {
        return (
            <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: match.profilePhoto }} style={styles.profileImage} resizeMode="cover" />
                    {match.compatibility > 80 && (
                        <View style={styles.matchBadge}>
                            <Heart size={10} color="white" fill="white" />
                            <Text style={styles.matchBadgeText}>{match.compatibility}%</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.heartIcon}>
                        <Heart size={20} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.name} numberOfLines={2}>{match.name}</Text>

                    <View style={styles.detailsList}>
                        <View style={styles.detailItem}>
                            <GraduationCap size={12} color={Colors.gray} />
                            <Text style={styles.detailText}>{match.education}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Clock size={12} color={Colors.gray} />
                            <Text style={styles.detailText}>{match.dob}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Clock size={12} color={Colors.gray} />
                            <Text style={styles.detailText}>{match.time}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <MapPin size={12} color={Colors.gray} />
                            <Text style={styles.detailText}>{match.location}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.viewProfileBtn} onPress={() => router.push(`/profile/${match._id}`)}>
                        <LinearGradient
                            colors={[Colors.primary, Colors.secondary]}
                            style={styles.btnGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.btnText}>View Profile</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    {/* Back button if needed, or menu */}
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Interested</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Search size={24} color={Colors.black} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFilters(!showFilters)}>
                        <SlidersHorizontal size={24} color={Colors.black} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar (Optional, matches image "Search") */}
            <View style={styles.searchContainer}>
                <Search size={20} color={Colors.primary} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor={Colors.gray}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity>
                    <SlidersHorizontal size={20} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={matches}
                    renderItem={({ item }) => <MatchCard match={item} />}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: Colors.white,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.black,
        fontFamily: 'SpaceMono',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 15
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.primaryLight,
        backgroundColor: Colors.white,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
        fontFamily: 'SpaceMono',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100, // Bottom tab clearance
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    cardContainer: {
        width: CARD_WIDTH,
        backgroundColor: Colors.white,
        borderRadius: 15,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        overflow: 'hidden'
    },
    imageContainer: {
        height: 180,
        width: '100%',
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    matchBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: Colors.primary, // Red/Pink
        borderRadius: 12, // Heart shape-ish or circle
        width: 30, // Adjust for heart shape
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        // Simple circle for now
        borderRadius: 15,
    },
    matchBadgeText: {
        color: 'white',
        fontSize: 8,
        fontWeight: 'bold',
        position: 'absolute',
        top: 8, // Center over heart? Or separate? Image shows "99%" inside a heart
    },
    heartIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
    },
    cardContent: {
        padding: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
        fontFamily: 'SpaceMono',
    },
    detailsList: {
        gap: 4,
        marginBottom: 12
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    detailText: {
        fontSize: 12,
        color: Colors.gray,
        fontFamily: 'SpaceMono',
    },
    viewProfileBtn: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    btnGradient: {
        paddingVertical: 8,
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'SpaceMono',
    }
});

export default MatchesPage;
