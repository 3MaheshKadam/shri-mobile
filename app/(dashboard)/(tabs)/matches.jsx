import { BlurView } from 'expo-blur';
import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Dimensions,
    StyleSheet,
    Modal,
    ActivityIndicator,
    Alert,
    RefreshControl
} from 'react-native';
import {
    Heart,
    MapPin,
    GraduationCap,
    Clock,
    Filter,
    Search,
    SlidersHorizontal,
    X,
    Briefcase,
    Send,
    CheckCircle
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '@/context/SessionContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { fetchAllUsers, sendInterest } from '@/utils/api';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const MatchesPage = () => {
    const { user, subscriptionPlan, isSubscribed } = useSession();
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sendingInterest, setSendingInterest] = useState({});
    const insets = useSafeAreaInsets();

    // Filter states
    const [filters, setFilters] = useState({
        gender: '',
        minAge: '',
        maxAge: '',
        city: '',
        caste: '',
        maritalStatus: '',
        education: '',
        income: '',
    });

    const fetchMatches = async (showLoader = true) => {
        try {
            if (showLoader) setIsLoading(true);

            // Build filter object
            const filterParams = {};

            // Auto-filter opposite gender if user has gender set
            if (user?.gender) {
                const targetGender = user.gender === 'Male' ? 'Female' : 'Male';
                filterParams.gender = filters.gender || targetGender;
            }

            // Add other filters if set
            if (filters.minAge) filterParams.minAge = parseInt(filters.minAge);
            if (filters.maxAge) filterParams.maxAge = parseInt(filters.maxAge);
            if (filters.city) filterParams.city = filters.city;
            if (filters.caste) filterParams.caste = filters.caste;
            if (filters.maritalStatus) filterParams.maritalStatus = filters.maritalStatus;
            if (filters.education) filterParams.education = filters.education;
            if (filters.income) filterParams.income = filters.income;

            console.log('Fetching matches with filters:', filterParams);

            const response = await fetchAllUsers(filterParams);

            if (response.success && Array.isArray(response.data)) {
                const mappedMatches = response.data.map(item => {
                    // Calculate Age from DOB
                    let age = 'N/A';
                    if (item.dob) {
                        const birthDate = new Date(item.dob);
                        const today = new Date();
                        age = today.getFullYear() - birthDate.getFullYear();
                        const m = today.getMonth() - birthDate.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }
                    }

                    return {
                        _id: item._id,
                        name: item.name || 'Unknown',
                        age: age,
                        location: item.currentCity || 'Unknown',
                        education: item.education || 'Not Specified',
                        occupation: item.occupation || '',
                        profilePhoto: item.profilePhoto || item.photos?.[0]?.url || 'https://via.placeholder.com/150',
                        isVerified: item.isVerified || false,
                        compatibility: Math.floor(Math.random() * (98 - 70 + 1) + 70),
                        height: item.height || '',
                        caste: item.caste || '',
                        maritalStatus: item.maritalStatus || '',
                    };
                });
                setMatches(mappedMatches);
            } else {
                console.error("Failed to fetch matches:", response);
                Alert.alert("Error", "Could not fetch profiles.");
            }
        } catch (error) {
            console.error("Error fetching matches:", error);
            Alert.alert("Error", "Network error. Please try again.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, [filters]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchMatches(false);
    };

    const handleSendInterest = async (receiverId) => {
        try {
            setSendingInterest(prev => ({ ...prev, [receiverId]: true }));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            const response = await sendInterest(receiverId);

            if (response.success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert("Success", "Interest sent successfully!");
            } else {
                Alert.alert("Error", response.message || "Failed to send interest");
            }
        } catch (error) {
            console.error("Send interest error:", error);
            Alert.alert("Error", "Failed to send interest. Please try again.");
        } finally {
            setSendingInterest(prev => ({ ...prev, [receiverId]: false }));
        }
    };

    const applyFilters = () => {
        setShowFilters(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        fetchMatches();
    };

    const clearFilters = () => {
        setFilters({
            gender: '',
            minAge: '',
            maxAge: '',
            city: '',
            caste: '',
            maritalStatus: '',
            education: '',
            income: '',
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const MatchCard = memo(({ match }) => {
        const isSending = sendingInterest[match._id];

        return (
            <View style={styles.cardContainer}>
                <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={() => router.push(`/profile/${match._id}`)}
                    activeOpacity={0.9}
                >
                    <Image source={{ uri: match.profilePhoto }} style={styles.profileImage} resizeMode="cover" />
                    {match.compatibility > 80 && (
                        <View style={styles.matchBadge}>
                            <Text style={styles.matchBadgeText}>{match.compatibility}%</Text>
                        </View>
                    )}
                    {match.isVerified && (
                        <View style={styles.verifiedBadge}>
                            <CheckCircle size={16} color="white" fill={Colors.primary} />
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.heartIcon}
                        onPress={() => handleSendInterest(match._id)}
                        disabled={isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator size="small" color={Colors.primary} />
                        ) : (
                            <Send size={18} color={Colors.primary} />
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.cardContent}>
                    <Text style={styles.name} numberOfLines={1}>{match.name}</Text>

                    <View style={styles.detailsList}>
                        {match.age !== 'N/A' && (
                            <View style={styles.detailItem}>
                                <Clock size={12} color={Colors.gray} />
                                <Text style={styles.detailText}>{match.age} yrs</Text>
                            </View>
                        )}
                        {match.height && (
                            <View style={styles.detailItem}>
                                <Text style={styles.detailText}>📏 {match.height}</Text>
                            </View>
                        )}
                        <View style={styles.detailItem}>
                            <MapPin size={12} color={Colors.gray} />
                            <Text style={styles.detailText} numberOfLines={1}>{match.location}</Text>
                        </View>
                        {match.education && (
                            <View style={styles.detailItem}>
                                <GraduationCap size={12} color={Colors.gray} />
                                <Text style={styles.detailText} numberOfLines={1}>{match.education}</Text>
                            </View>
                        )}
                        {match.occupation && (
                            <View style={styles.detailItem}>
                                <Briefcase size={12} color={Colors.gray} />
                                <Text style={styles.detailText} numberOfLines={1}>{match.occupation}</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.viewProfileBtn}
                        onPress={() => router.push(`/profile/${match._id}`)}
                    >
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

    const FilterModal = () => (
        <Modal
            visible={showFilters}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowFilters(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filters</Text>
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <X size={24} color={Colors.black} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.filterScroll} showsVerticalScrollIndicator={false}>
                        {/* Age Range */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Age Range</Text>
                            <View style={styles.filterRow}>
                                <TextInput
                                    style={styles.filterInput}
                                    placeholder="Min"
                                    keyboardType="numeric"
                                    value={filters.minAge}
                                    onChangeText={(text) => setFilters(prev => ({ ...prev, minAge: text }))}
                                />
                                <Text style={styles.filterSeparator}>to</Text>
                                <TextInput
                                    style={styles.filterInput}
                                    placeholder="Max"
                                    keyboardType="numeric"
                                    value={filters.maxAge}
                                    onChangeText={(text) => setFilters(prev => ({ ...prev, maxAge: text }))}
                                />
                            </View>
                        </View>

                        {/* City */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>City</Text>
                            <TextInput
                                style={styles.filterInputFull}
                                placeholder="Enter city name"
                                value={filters.city}
                                onChangeText={(text) => setFilters(prev => ({ ...prev, city: text }))}
                            />
                        </View>

                        {/* Caste */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Caste</Text>
                            <TextInput
                                style={styles.filterInputFull}
                                placeholder="Enter caste"
                                value={filters.caste}
                                onChangeText={(text) => setFilters(prev => ({ ...prev, caste: text }))}
                            />
                        </View>

                        {/* Marital Status */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Marital Status</Text>
                            <View style={styles.filterChips}>
                                {['Unmarried', 'Divorced', 'Widowed'].map(status => (
                                    <TouchableOpacity
                                        key={status}
                                        style={[
                                            styles.filterChip,
                                            filters.maritalStatus === status && styles.filterChipActive
                                        ]}
                                        onPress={() => setFilters(prev => ({
                                            ...prev,
                                            maritalStatus: prev.maritalStatus === status ? '' : status
                                        }))}
                                    >
                                        <Text style={[
                                            styles.filterChipText,
                                            filters.maritalStatus === status && styles.filterChipTextActive
                                        ]}>{status}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Education */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Education</Text>
                            <TextInput
                                style={styles.filterInputFull}
                                placeholder="e.g., B.Tech, MBA"
                                value={filters.education}
                                onChangeText={(text) => setFilters(prev => ({ ...prev, education: text }))}
                            />
                        </View>

                        {/* Income */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Income</Text>
                            <View style={styles.filterChips}>
                                {['0-5 LPA', '5-10 LPA', '10-20 LPA', '20+ LPA'].map(income => (
                                    <TouchableOpacity
                                        key={income}
                                        style={[
                                            styles.filterChip,
                                            filters.income === income && styles.filterChipActive
                                        ]}
                                        onPress={() => setFilters(prev => ({
                                            ...prev,
                                            income: prev.income === income ? '' : income
                                        }))}
                                    >
                                        <Text style={[
                                            styles.filterChipText,
                                            filters.income === income && styles.filterChipTextActive
                                        ]}>{income}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
                            <Text style={styles.clearBtnText}>Clear All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
                            <LinearGradient
                                colors={[Colors.primary, Colors.secondary]}
                                style={styles.applyBtnGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.applyBtnText}>Apply Filters</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Text style={styles.headerTitle}>Matches</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFilters(true)}>
                        <SlidersHorizontal size={24} color={Colors.black} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search size={20} color={Colors.primary} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search by name..."
                    placeholderTextColor={Colors.gray}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Active Filters Display */}
            {(filters.city || filters.caste || filters.maritalStatus || filters.minAge || filters.maxAge) && (
                <ScrollView
                    horizontal
                    style={styles.activeFilters}
                    showsHorizontalScrollIndicator={false}
                >
                    {filters.minAge && filters.maxAge && (
                        <View style={styles.activeFilterChip}>
                            <Text style={styles.activeFilterText}>Age: {filters.minAge}-{filters.maxAge}</Text>
                        </View>
                    )}
                    {filters.city && (
                        <View style={styles.activeFilterChip}>
                            <Text style={styles.activeFilterText}>📍 {filters.city}</Text>
                        </View>
                    )}
                    {filters.caste && (
                        <View style={styles.activeFilterChip}>
                            <Text style={styles.activeFilterText}>{filters.caste}</Text>
                        </View>
                    )}
                    {filters.maritalStatus && (
                        <View style={styles.activeFilterChip}>
                            <Text style={styles.activeFilterText}>{filters.maritalStatus}</Text>
                        </View>
                    )}
                </ScrollView>
            )}

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
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={[Colors.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No matches found.</Text>
                            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
                        </View>
                    }
                />
            )}

            <FilterModal />
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
    iconBtn: {
        padding: 5,
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
    activeFilters: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    activeFilterChip: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
    },
    activeFilterText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
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
        left: 10,
        backgroundColor: Colors.primary,
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    matchBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    verifiedBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    heartIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
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
        fontSize: 11,
        color: Colors.gray,
        fontFamily: 'SpaceMono',
        flex: 1,
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
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.gray,
        fontFamily: 'SpaceMono',
    },
    emptySubtext: {
        fontSize: 14,
        color: Colors.gray,
        marginTop: 5,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
        fontFamily: 'SpaceMono',
    },
    filterScroll: {
        padding: 20,
    },
    filterSection: {
        marginBottom: 20,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.black,
        marginBottom: 10,
        fontFamily: 'SpaceMono',
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    filterInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 14,
        fontFamily: 'SpaceMono',
    },
    filterInputFull: {
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 14,
        fontFamily: 'SpaceMono',
    },
    filterSeparator: {
        color: Colors.gray,
        fontSize: 14,
    },
    filterChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        backgroundColor: Colors.white,
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterChipText: {
        fontSize: 13,
        color: Colors.gray,
        fontFamily: 'SpaceMono',
    },
    filterChipTextActive: {
        color: Colors.white,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    clearBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.primary,
        alignItems: 'center',
    },
    clearBtnText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'SpaceMono',
    },
    applyBtn: {
        flex: 1,
        borderRadius: 25,
        overflow: 'hidden',
    },
    applyBtnGradient: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    applyBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'SpaceMono',
    },
});

export default MatchesPage;
