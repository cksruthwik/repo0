// src/App.jsx
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './Login/AuthContext'; // Import AuthProvider and useAuth
import Sidebar from './components/Sidebar/Sidebar';
import ChatBot from './components/chatbot/chatBot';
import Summarizer from './components/summarizer/summarizer';
import MindMapper from './components/mindmapper/mindmapper';
import Settings from './components/settings/settings';
import Login from './Login/Login'; // Keep Login component
import './App.css';

// --- Import Icons ---
import { HiMenu } from 'react-icons/hi';
import { IoChatbox, IoClose } from 'react-icons/io5';

// --- View Definitions ---
export const VIEWS = {
  CHATBOT: 'Chat Bot',
  SUMMARIZER: 'Summarizer',
  MIND_MAP: 'Mind Mapping',
  SETTINGS: 'Settings',
};

// --- Logo Path (Relative for build output) ---
const coeusLogoPath = 'icons/icon128.png'; // Path relative to the root of the dist folder

// --- Theme ---
const DEFAULT_THEME = 'light'; // Start with light theme

// --- App Content Component (Handles rendering logic) ---
function AppContent() {
  // Get auth state and functions from the context
  const { isAuthenticated, loading, logout } = useAuth();

  // Local component state
  const [activeView, setActiveView] = useState(VIEWS.CHATBOT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatbotKey, setChatbotKey] = useState(Date.now()); // Used to force ChatBot remount on reset
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [userEmail, setUserEmail] = useState(''); // Store email if needed for display

  // --- Load Theme and potentially stored User Email ---
  useEffect(() => {
    let isMounted = true;
    // Use chrome.storage.sync for theme and userEmail (if persisted)
    if (chrome?.storage?.sync) {
        chrome.storage.sync.get(['appTheme', 'userEmail'], (result) => {
            if (isMounted) {
                if (chrome.runtime.lastError) {
                    console.error("AppContent: Error loading theme/email from sync storage:", chrome.runtime.lastError.message);
                } else {
                    // Load Theme
                    const savedTheme = result.appTheme;
                    if (savedTheme === 'light' || savedTheme === 'dark') {
                        setTheme(savedTheme);
                    } else {
                        setTheme(DEFAULT_THEME);
                        // Optionally save default theme if not set
                        chrome.storage.sync.set({ appTheme: DEFAULT_THEME }, () => {
                            if (chrome.runtime.lastError) console.error("AppContent: Error saving default theme:", chrome.runtime.lastError.message);
                        });
                    }

                    // Load Email if stored
                    if (result.userEmail) {
                        setUserEmail(result.userEmail);
                        console.log("AppContent: Loaded user email from storage:", result.userEmail);
                    }
                }
            }
        });
    } else {
      console.warn("AppContent: chrome.storage.sync not available.");
      setTheme(DEFAULT_THEME); // Fallback if storage API is missing
    }
    return () => { isMounted = false; }; // Cleanup function
  }, []); // Run only once on mount

  // --- Handle Logo Loading Error ---
  const handleLogoError = (e) => {
    console.error("AppContent: Failed to load logo image.");
    e.target.onerror = null; // Prevent infinite loop if fallback also fails
    e.target.style.display = 'none'; // Hide broken image
    // Optionally, display placeholder text or a default icon
  };

  // --- Toggle Theme Function ---
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Use chrome.storage.sync to save theme preference
    if (chrome?.storage?.sync) {
        chrome.storage.sync.set({ appTheme: newTheme }, () => {
            if (chrome.runtime.lastError) {
                console.error("AppContent: Error saving theme to sync storage:", chrome.runtime.lastError.message);
            } else {
                console.log("AppContent: Theme saved:", newTheme);
            }
        });
    }
  };

  // --- Render Current View Based on activeView State ---
  const renderView = () => {
    switch (activeView) {
      case VIEWS.CHATBOT:
        // Pass key to force remount on reset, pass view control props
        return <ChatBot key={chatbotKey} setActiveView={setActiveView} VIEWS={VIEWS} />;
      case VIEWS.SUMMARIZER:
        return <Summarizer />;
      case VIEWS.MIND_MAP:
        return <MindMapper />;
      case VIEWS.SETTINGS:
        // Pass theme controls, logout handler, and email to Settings
        return <Settings theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} userEmail={userEmail} />;
      default:
        // Fallback to ChatBot if activeView is somehow invalid
        return <ChatBot key={chatbotKey} setActiveView={setActiveView} VIEWS={VIEWS} />;
    }
  };

  // --- Sidebar Toggle ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // --- Reset Chat Functionality ---
  const resetChat = () => {
        console.log("AppContent: Resetting chat.");
        setActiveView(VIEWS.CHATBOT); // Switch view to ChatBot
        setChatbotKey(Date.now()); // Change key to force ChatBot remount/reset
        if (isSidebarOpen) { setIsSidebarOpen(false); } // Close sidebar if open
  };

  // --- Handle Logout (Triggered from Settings Component) ---
  const handleLogout = async () => {
      console.log("AppContent: Handling logout...");
      try {
          await logout(); // Call logout from AuthContext (clears token state and storage)
          setUserEmail(''); // Clear local email state
          // Remove email from storage as well
          if (chrome?.storage?.sync) {
              chrome.storage.sync.remove('userEmail', () => {
                  if(chrome.runtime.lastError) console.error("AppContent: Error removing userEmail from storage:", chrome.runtime.lastError.message);
                  else console.log("AppContent: User email removed from storage.");
              });
          }
          setActiveView(VIEWS.SETTINGS); // Navigate to Settings view after logout
          console.log("AppContent: Logout successful.");
      } catch (error) {
          console.error("AppContent: Error during logout:", error);
          // Handle logout error if necessary
      }
  };

   // --- Handle Login Success (Passed to and Called by Login Component) ---
   const onLoginSuccess = (email) => {
        console.log("AppContent: Login successful for:", email);
        // AuthContext already sets the token and isAuthenticated state.
        // We just need to store the email for display/use and navigate.
        setUserEmail(email);
        // Persist email in chrome.storage.sync
        if (chrome?.storage?.sync) {
            chrome.storage.sync.set({ userEmail: email }, () => {
                if (chrome.runtime.lastError) console.error("AppContent: Error saving userEmail to storage:", chrome.runtime.lastError.message);
                else console.log("AppContent: User email saved to storage.");
            });
        }
        setActiveView(VIEWS.CHATBOT); // Navigate to Chatbot view after successful login
   };

  // --- RENDER LOGIC BASED ON AUTH/LOADING STATE ---

  // 1. Show Loading Indicator
  if (loading) {
    console.log("AppContent: Auth loading...");
    // Simple text loader, replace with a spinner component if desired
    return (
      <div className={`app-container ${theme}-theme`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // 2. Show Login Component if Not Authenticated
  if (!isAuthenticated) {
    console.log("AppContent: User not authenticated, rendering Login.");
    // Pass the success handler down to the Login component
    return <Login onLoginSuccess={onLoginSuccess} />;
  }

  // 3. Show Authenticated App UI
  console.log("AppContent: User authenticated, rendering main app.");
  return (
    <div className={`app-container ${theme}-theme ${isSidebarOpen ? 'sidebar-visible' : ''}`}>
      {/* --- Header --- */}
      <header className="app-header">
        <div className="header-left">
          <button onClick={toggleSidebar} className="hamburger-button" title="Toggle Menu"><HiMenu /></button>
        </div>
        <div className="header-center">
          <img src={coeusLogoPath} alt="Coeus Logo" className="header-logo" onError={handleLogoError} />
          <span className="header-title">Coeus</span>
        </div>
        <div className="header-right">
          <div className="window-controls">
             <span onClick={() => window.open('https://www.feuji.com', '_blank')}
                title="Export (Temp: Feuji)" // Update title as needed
                style={{ cursor: 'pointer' }}>
                📤
              </span>
            <span onClick={resetChat} title="New Chat" style={{ cursor: 'pointer' }}><IoChatbox /></span>
            <span onClick={() => window.close()} title="Close" style={{ cursor: 'pointer' }}><IoClose /></span>
          </div>
        </div>
      </header>

      {/* --- Sidebar Component --- */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        viewDefinitions={VIEWS} // Pass the definitions object
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* --- Overlay for Sidebar --- */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* --- Main Content Area --- */}
      <main className="view-area">
        {renderView()} {/* Render the component based on activeView */}
      </main>
    </div>
  );
}

// --- Root App Component (Wraps everything in AuthProvider) ---
function App() {
  return (
    // AuthProvider manages authentication state and makes it available via useAuth()
    <AuthProvider>
      <AppContent /> {/* The actual UI component */}
    </AuthProvider>
  );
}

export default App;