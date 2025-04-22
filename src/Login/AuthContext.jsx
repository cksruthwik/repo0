// src/Login/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as verifyOtp, refresh as doRefresh } from './LoginService'; // Assuming LoginService handles API calls

const AuthContext = createContext(null);

// --- Chrome Storage Helper Functions ---

// Gets the token from chrome.storage.local
const getTokenFromStorage = () => {
  return new Promise((resolve) => {
    // Check if chrome.storage is available
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['accessToken'], (result) => {
        if (chrome.runtime.lastError) {
          console.error("AuthContext: Error getting token from chrome.storage:", chrome.runtime.lastError.message);
          resolve(null); // Resolve with null on error
        } else {
          console.log("AuthContext: Token retrieved from storage:", result.accessToken);
          resolve(result.accessToken || null); // Resolve with token or null
        }
      });
    } else {
      console.warn("AuthContext: chrome.storage.local not available. Cannot get token.");
      resolve(null); // Resolve with null if API is unavailable
    }
  });
};

// Sets the token in chrome.storage.local
const setTokenInStorage = (token) => {
  return new Promise((resolve, reject) => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ accessToken: token }, () => {
        if (chrome.runtime.lastError) {
          console.error("AuthContext: Error setting token in chrome.storage:", chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError); // Reject on error
        } else {
          console.log("AuthContext: Token stored successfully in chrome.storage.");
          resolve(); // Resolve on success
        }
      });
    } else {
      console.warn("AuthContext: chrome.storage.local not available. Cannot set token.");
      resolve(); // Resolve even if API is unavailable, but log warning
    }
  });
};

// Removes the token from chrome.storage.local
const removeTokenFromStorage = () => {
  return new Promise((resolve, reject) => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.remove(['accessToken'], () => {
        if (chrome.runtime.lastError) {
          console.error("AuthContext: Error removing token from chrome.storage:", chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError); // Reject on error
        } else {
          console.log("AuthContext: Token removed successfully from chrome.storage.");
          resolve(); // Resolve on success
        }
      });
    } else {
      console.warn("AuthContext: chrome.storage.local not available. Cannot remove token.");
      resolve(); // Resolve even if API is unavailable
    }
  });
};


// --- AuthProvider Component ---
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading until auth check is done

  // --- Effect for Initial Authentication Check ---
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const initializeAuth = async () => {
      setLoading(true); // Ensure loading is true while checking
      console.log("AuthContext: Initializing authentication...");
      try {
        const storedToken = await getTokenFromStorage();
        console.log("AuthContext: Initial check - storedToken =", storedToken);

        if (storedToken) {
          // Optional: Add token validation logic here if needed
          console.log("AuthContext: Found token in storage. Setting state.");
          if (isMounted) {
            setAccessToken(storedToken);
          }
        } else {
          // No stored token, attempt refresh (if applicable)
          console.log("AuthContext: No token in storage. Attempting refresh...");
          try {
            // Assuming doRefresh returns { access_token: '...' } on success
            const { access_token: refreshedToken } = await doRefresh();
            console.log("AuthContext: Refresh successful, new token:", refreshedToken);
            if (isMounted) {
              setAccessToken(refreshedToken);
              await setTokenInStorage(refreshedToken); // Store the refreshed token
            }
          } catch (refreshError) {
            console.log("AuthContext: Refresh failed.", refreshError.message);
            // Ensure state is logged out if refresh fails
            if (isMounted) {
              setAccessToken(null);
              await removeTokenFromStorage(); // Clear any potentially invalid stored token
            }
          }
        }
      } catch (error) {
        console.error("AuthContext: Error during auth initialization:", error);
        if (isMounted) {
          setAccessToken(null); // Ensure logged out state on error
          await removeTokenFromStorage();
        }
      } finally {
        if (isMounted) {
          console.log("AuthContext: Initialization complete.");
          setLoading(false); // Finish loading regardless of outcome
        }
      }
    };

    initializeAuth();

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Login Function ---
  const login = useCallback(async (email, otp) => { // Use useCallback for stability if passed down
    setLoading(true); // Indicate loading during login attempt
    try {
      // Assuming verifyOtp returns { access_token: '...' } on success
      const { access_token: newToken } = await verifyOtp(email, otp);
      console.log('AuthContext: ✅ Login successful, received token:', newToken);
      await setTokenInStorage(newToken); // Store token asynchronously
      setAccessToken(newToken); // Update state
      setLoading(false); // Stop loading on success
      return newToken; // Return token on success
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      setAccessToken(null); // Clear state on failure
      await removeTokenFromStorage(); // Clear storage on failure
      setLoading(false); // Stop loading on failure
      throw error; // Re-throw error to be caught by the calling component (Login.jsx)
    }
  }, []); // No dependencies, function logic is self-contained

  // --- Logout Function ---
  const logout = useCallback(async () => { // Use useCallback
    console.log("AuthContext: Logging out...");
    // Optional: Call backend logout endpoint here if needed
    // try { await backendLogout(); } catch (e) { console.error("Backend logout failed:", e); }
    setAccessToken(null); // Clear state immediately
    await removeTokenFromStorage(); // Clear storage asynchronously
    // No need to set loading state during logout usually
  }, []); // No dependencies

  // --- Authenticated Fetch Function (Example) ---
  // This function handles adding the token and attempting refresh on 401
  const authFetch = useCallback(async (input, init = {}) => {
    // Get the current token *before* making the request
    const currentToken = accessToken; // Use state token for initial check
    console.log("AuthContext: authFetch called. Current token state:", currentToken);

    const headers = {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {})
    };

    let response = await fetch(input, {
      ...init,
      headers: headers,
      // credentials: 'include', // Only include if your REFRESH mechanism relies on httpOnly cookies sent by the server
    });

    // If unauthorized (401) and we had a token, try refreshing
    if (response.status === 401 && currentToken) {
      console.log("AuthContext: Received 401, attempting token refresh...");
      try {
        const { access_token: refreshedToken } = await doRefresh();
        console.log("AuthContext: Refresh successful during fetch, new token:", refreshedToken);

        // Update state and storage
        setAccessToken(refreshedToken);
        await setTokenInStorage(refreshedToken);

        // Retry the original request with the new token
        const newHeaders = {
          ...headers,
          Authorization: `Bearer ${refreshedToken}`
        };
        console.log("AuthContext: Retrying fetch with refreshed token.");
        response = await fetch(input, {
          ...init,
          headers: newHeaders,
          // credentials: 'include', // If needed
        });

      } catch (refreshError) {
        console.error("AuthContext: Refresh failed during fetch:", refreshError);
        // If refresh itself fails, log the user out completely
        await logout(); // Use the logout function to clear state and storage
        // Throw a specific error to indicate session expiration
        throw new Error("Session expired. Please log in again.");
      }
    }

    // Return the final response (either the original successful one, the retried one, or an error response if not 401/refresh failed)
    return response;
  }, [accessToken, logout]); // Depend on accessToken and logout


  // --- Provide Context Value ---
  // Calculate isAuthenticated based on token presence AND loading state
  const isAuthenticated = !!accessToken && !loading;

  const contextValue = {
    accessToken,
    loading, // Provide loading state to consumers
    isAuthenticated, // Provide derived authenticated state
    login,
    logout,
    authFetch // Provide the authenticated fetch helper
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading ? children : null} {/* Optionally render children only when not loading, or show a loader */}
      {/* Or just render children always and let consumers handle the loading state: */}
      {/* {children} */}
    </AuthContext.Provider>
  );
}

// --- Custom Hook to Use Auth Context ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};