// import { createContext, useContext, useEffect, useState } from 'react';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const SessionContext = createContext();

// export function SessionProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Check for existing session on initial load
//   useEffect(() => {
//     async function loadUser() {
//       try {
//         // First try to get session from AsyncStorage
//         const storedUser = await AsyncStorage.getItem('user');
//         if (storedUser) {
//           setUser(JSON.parse(storedUser));
//           return;
//         }

//         // If not in AsyncStorage, try API
//         const response = await fetch(`${Config.API_URL}/api/session`, {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         const result = await response.json();
//         console.log("✅ SessionContext: /api/session result:", result);

//         if (result.user) {
//           setUser(result.user);
//           await AsyncStorage.setItem('user', JSON.stringify(result.user));
//         }
//       } catch (error) {
//         console.error("❌ Failed to load session:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadUser();
//   }, []);

//   // Login function
//   const login = async (userId) => {
//     try {
//       const response = await fetch(`${Config.API_URL}/api/session`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.user);
//         await AsyncStorage.setItem('user', JSON.stringify(data.user));
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Login failed:', error);
//       return false;
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       await fetch(`${Config.API_URL}/api/logout`, { 
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       setUser(null);
//       await AsyncStorage.removeItem('user');
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     isAuthenticated: !!user,
//     isPhoneVerified: user?.phoneIsVerified || false,
//   };

//   return (
//     <SessionContext.Provider value={value}>
//       {children}
//     </SessionContext.Provider>
//   );
// }

// export function useSession() {
//   const context = useContext(SessionContext);
//   if (context === undefined) {
//     throw new Error('useSession must be used within a SessionProvider');
//   }
//   return context;
// }
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '@/constants/Config';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on initial load
  useEffect(() => {
    async function loadUser() {
      try {
        // First try to get from AsyncStorage
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('Loaded user ID from AsyncStorage:', parsedUser.id, 'Phone:', parsedUser?.phone || parsedUser?.phoneNumber);
          // Validate with API
          const response = await fetch(`${Config.API_URL}/api/session`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          const result = await response.json();
          console.log("✅ SessionContext: /api/session result:", result);

          if (result.user) {
            setUser(result.user);
            await AsyncStorage.setItem('user', JSON.stringify(result.user));
            console.log('Loaded user ID from API:', result.user.id, 'Phone:', result.user?.phone || result.user?.phoneNumber);
          } else {
            // Invalid token, clear storage
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error("❌ Failed to load session:", error);
        // If API fails, stick with stored user if available
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Login function
  const login = async (userId) => {
    try {
      console.log('SessionContext: Logging in user:', userId);

      // Fetch user data from API
      const { getCurrentUser } = await import('@/utils/api');
      const response = await getCurrentUser();

      if (response.success && response.user) {
        console.log('SessionContext: User data fetched:', response.user);
        setUser(response.user);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Update user function
  const updateUser = async (userData) => {
    try {
      const { updateUserProfile } = await import('@/utils/api');
      const response = await updateUserProfile(userData);

      if (response.success && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Update user failed:', error);
      return false;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const { getCurrentUser } = await import('@/utils/api');
      const response = await getCurrentUser();

      if (response.success && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Refresh user failed:', error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        await fetch(`${Config.API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`,
          },
        });
      }
      setUser(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user,
    isPhoneVerified: user?.phoneIsVerified || false,
    subscriptionPlan: user?.subscription?.plan || 'free',
    isSubscribed: user?.subscription?.isSubscribed || false,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}