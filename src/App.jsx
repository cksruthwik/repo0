import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar'; // Assuming path is correct
import ChatBot from './components/chatbot/chatbot'; // Corrected to match file casing
import Summarizer from './components/Summarizer/Summarizer'; // Assuming path is correct
import MindMapper from './components/MindMapper/MindMapper'; // Assuming path is correct
import Settings from './components/Settings/Settings'; // Assuming path is correct
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

// --- Logo Path ---
const coeusLogoPath = '/icons/icon128.png'; // Verify path

// --- Theme ---
const DEFAULT_THEME = 'light'; // Start with light theme

function App() {
  const [activeView, setActiveView] = useState(VIEWS.CHATBOT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatbotKey, setChatbotKey] = useState(Date.now());
  const [theme, setTheme] = useState(DEFAULT_THEME); // Add theme state

  // --- Load Theme on Mount ---
  useEffect(() => {
    let isMounted = true;
    if (chrome?.storage?.sync) {
      chrome.storage.sync.get(['appTheme'], (result) => {
        if (isMounted) {
           if (chrome.runtime.lastError) { console.error("Error loading theme:", chrome.runtime.lastError); }
           else {
               const savedTheme = result.appTheme;
               if (savedTheme === 'light' || savedTheme === 'dark') { setTheme(savedTheme); }
               else { setTheme(DEFAULT_THEME); }
           }
        }
      });
    } else { setTheme(DEFAULT_THEME); }
     return () => { isMounted = false; };
  }, []);

  // Handle logo loading errors
  const handleLogoError = (e) => {
    e.target.onerror = null;
    e.target.style.display = 'none';
    const placeholder = e.target.nextElementSibling;
    if (placeholder) placeholder.style.display = 'inline';
  };

  // --- Toggle Theme Function ---
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (chrome?.storage?.sync) {
        chrome.storage.sync.set({ appTheme: newTheme }, () => {
            if (chrome.runtime.lastError) { console.error("Error saving theme:", chrome.runtime.lastError); }
        });
    }
  };
  // --- End Toggle Theme Function ---

  const renderView = () => {
    switch (activeView) {
      case VIEWS.CHATBOT:
        return <ChatBot key={chatbotKey} setActiveView={setActiveView} VIEWS={VIEWS} />;
      case VIEWS.SUMMARIZER:
        return <Summarizer />;
      case VIEWS.MIND_MAP:
        return <MindMapper />;
      case VIEWS.SETTINGS:
        // Pass theme state and toggle function to Settings
        return <Settings theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <ChatBot key={chatbotKey} setActiveView={setActiveView} VIEWS={VIEWS} />;
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

   const resetChat = () => {
        setActiveView(VIEWS.CHATBOT);
        setChatbotKey(Date.now());
        if (isSidebarOpen) { setIsSidebarOpen(false); }
   };

  return (
    // Add theme class and sidebar class
    <div className={`app-container ${theme}-theme ${isSidebarOpen ? 'sidebar-visible' : ''}`}>
      <header className="app-header">
        <div className="header-left">
          <button onClick={toggleSidebar} className="hamburger-button" title="Toggle Menu"><HiMenu /></button>
        </div>
        <div className="header-center">
          <img src={coeusLogoPath} alt="" className="header-logo" onError={handleLogoError} />
          <span className="header-title">Coeus</span>
        </div>
        <div className="header-right">
          <div className="window-controls">
            <span onClick={() => window.open('https://www.dummyadmin.com', '_blank')}
                title="Export" 
                style={{ cursor: 'pointer' }}>
                📤
              </span>
            <span onClick={resetChat} title="New Chat" style={{ cursor: 'pointer' }}><IoChatbox /></span>
            <span onClick={() => window.close()} title="Close" style={{ cursor: 'pointer' }}><IoClose /></span>
          </div>
        </div>
      </header>

      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        viewDefinitions={VIEWS}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <main className="view-area">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
