import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Heart, Users, User, Settings } from 'lucide-react-native';
import { useSession } from '../../context/SessionContext';
import { Redirect } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Functional Component for Icon
const TabBarIcon = ({ name, color, focused, size = 20 }) => {
  const IconComponent = {
    heart: Heart,
    users: Users,
    user: User,
    settings: Settings,
  }[name] || User;

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={focused ? 2.5 : 2}
      fill={focused ? color : 'transparent'}
    />
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const visibleRoutes = state.routes.filter(route => {
    const { options } = descriptors[route.key];
    return options.href !== null && route.name !== '(tabs)/profile';
  });

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          {visibleRoutes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);

            if (!options.tabBarIcon) return null;

            const iconName = route.name.includes('matches') ? 'heart' :
              route.name.includes('interests') ? 'users' :
                route.name.includes('profile') ? 'user' : 'settings';

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            };

            return (
              <TabButton
                key={route.key}
                iconName={iconName}
                label={options.title}
                isFocused={isFocused}
                onPress={onPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const TabButton = ({ iconName, label, isFocused, onPress }) => {
  const scale = useSharedValue(isFocused ? 1 : 0.9);
  const translateY = useSharedValue(isFocused ? -5 : 0);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSpring(1.1, { damping: 10, stiffness: 100 });
      translateY.value = withSpring(-5, { damping: 10, stiffness: 100 });
    } else {
      scale.value = withSpring(0.9, { damping: 10, stiffness: 100 });
      translateY.value = withSpring(0, { damping: 10, stiffness: 100 });
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabButton}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {/* Glow Effect for Active Tab - Simple View, no Blur to avoid errors */}
        {isFocused && (
          <View style={[styles.glow, { backgroundColor: Colors.primaryLight }]} />
        )}

        <TabBarIcon
          name={iconName}
          color={isFocused ? Colors.primary : Colors.gray} // Gray when inactive
          focused={isFocused}
          size={24}
        />
      </Animated.View>

      <Text
        style={[
          styles.label,
          { color: isFocused ? Colors.primary : Colors.gray, fontWeight: isFocused ? '700' : '500' }
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default function MaliBandhanDashboardLayout() {
  const { user } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Intelligent Back Button Handling
  useEffect(() => {
    const backAction = () => {
      const isHomeTab = pathname.includes('matches');

      if (!isHomeTab) {
        router.push('/(dashboard)/(tabs)/matches');
        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [pathname]);

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
    >
      <Tabs.Screen
        name="(tabs)/matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="heart" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/interests"
        options={{
          title: 'Interests',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="users" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/profile"
        options={{
          href: null,
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="settings" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="interests/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="subscription/index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    // Removed zIndex/elevation from here, handle in wrapper
  },
  tabBarWrapper: {
    width: width - 40, // 20px padding on each side
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.96)', // Almost opaque for "faux glass"
    shadowColor: Colors.primary, // Colored shadow
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 0, // Padding handled by container
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    height: 75,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    width: 50,
    height: 50,
  },
  glow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.2,
    transform: [{ scale: 1.2 }],
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.2, // Clean sans-serif
    textAlign: 'center',
  },
});
