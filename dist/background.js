// public/background.js

// Example: Listen for messages (e.g., from content scripts or popup)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background received message:", message);
  
    if (message.action === "getToken") {
      chrome.storage.local.get(['accessToken'], (result) => {
        if (chrome.runtime.lastError) {
          console.error("BG: Error getting token:", chrome.runtime.lastError);
          sendResponse({ token: null, error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ token: result.accessToken || null });
        }
      });
      return true; // Indicates asynchronous response
    }
  
    // Add other message handlers if needed
  
    return false; // Indicates synchronous response or no response needed
  });
  
  // Example: Periodic token refresh (if your backend requires it)
  // This is a basic example, needs proper error handling and potentially
  // checking token expiry before attempting refresh.
  async function refreshToken() {
      console.log("BG: Attempting periodic token refresh...");
      try {
          // Assume doRefresh exists and works similar to AuthContext
          // You might need to duplicate or share the refresh logic
          // const { access_token: refreshedToken } = await doRefresh(); // Your actual refresh call
          // console.log("BG: Periodic refresh successful.");
          // await setTokenInStorage(refreshedToken); // Your storage function
  
          // For simulation:
          console.log("BG: (Simulated) Periodic refresh would happen here.");
  
      } catch (error) {
          console.error("BG: Periodic refresh failed:", error);
          // Handle failed refresh (e.g., clear token, require re-login)
          // await removeTokenFromStorage(); // Your storage function
      }
  }
  
  // Set up an alarm to run the refresh periodically (e.g., every 25 minutes)
  // Note: Alarms are not exact, Chrome optimizes them. Minimum is ~1 minute.
  chrome.alarms.create('tokenRefresher', {
    delayInMinutes: 1, // Run 1 minute after browser start/extension install
    periodInMinutes: 25 // Then repeat every 25 minutes
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'tokenRefresher') {
      refreshToken();
    }
  });
  
  console.log("Background service worker started.");
  
  // Keep the service worker alive briefly on startup if needed for initial tasks
  chrome.runtime.onStartup.addListener(() => {
      console.log("Browser startup, background worker active.");
      // Perform any startup tasks if necessary
  });