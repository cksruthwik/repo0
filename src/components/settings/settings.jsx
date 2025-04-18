import React, { useState, useEffect } from 'react';
import './Settings.css';
// Import ALL necessary icons
import { FaHistory, FaCog, FaStar, FaSun, FaMoon } from 'react-icons/fa'; // Removed FaKey

const DEFAULT_MODEL = 'claude-sonnet';

// Accept theme, toggleTheme, onLogout, userEmail props from App.jsx
function Settings({ theme, toggleTheme, onLogout, userEmail }) {
    // --- State ---
    // Removed apiKey state
    const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL); // Initialize with default
    const [statusMessage, setStatusMessage] = useState('');

    // --- Load only selectedModel ---
    useEffect(() => {
        let isMounted = true;
        if (chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.get(['selectedModel'], (result) => { // Only get selectedModel
                if (!isMounted) return;
                if (chrome.runtime.lastError) {
                    console.error("Error loading settings:", chrome.runtime.lastError);
                    setStatusMessage('Error loading settings.');
                    // Default is already set in useState
                } else {
                    const loadedModel = result.selectedModel;
                    // Update only if different from initial default
                    if (loadedModel && loadedModel !== DEFAULT_MODEL) {
                        setSelectedModel(loadedModel);
                    }
                }
            });
        } else {
            console.warn("Chrome storage API not available.");
            // Default is already set in useState
        }
        return () => { isMounted = false; };
    }, []);

    // --- Save only selectedModel ---
    const handleSave = () => {
        setStatusMessage('');
        if (chrome.storage && chrome.storage.sync) {
            // Only save selectedModel
            chrome.storage.sync.set({ selectedModel: selectedModel }, () => {
                 if (chrome.runtime.lastError) {
                    setStatusMessage('Error saving settings.');
                 } else {
                    setStatusMessage('Settings saved!');
                    setTimeout(() => setStatusMessage(''), 2000);
                 }
            });
        } else {
             setStatusMessage('Cannot save settings (API unavailable).');
        }
    };

    // --- Language Model Data ---
    const languageModels = [
        { id: 'claude-sonnet', name: 'Claude Sonnet', tag: 'Premium', icon: <FaStar />, info: 'Balanced speed and intelligence'},
        { id: 'llama-3.38B', name: 'LLaMa 3.3 (Meta)', info: 'General purpose chat' }, // Adjusted name slightly
        { id: 'mistral', name: 'Mistral', info: 'Advanced chat tasks' },
        { id: 'gpt-4o', name: 'GPT 4.0 (Open AI)', info: 'Quick response' } // Adjusted name
    ];

    // --- Main Return JSX (Rearranged) ---
    return (
        <div className="settings-container">
            {/* Settings Title Removed - Implicit */}
            {/* <h3>Settings</h3> */}

            {/* Language Model Selection FIRST */}
            {/* <div className="setting-group">
                <label className="setting-label">LANGUAGE MODELS</label>
                {languageModels.map(model => (
                    <div
                        key={model.id}
                        className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
                        onClick={() => setSelectedModel(model.id)}
                    >
                        <div className="model-name">
                            <span>{model.name}</span>
                            {model.tag && <span className="model-tag">{model.icon}{model.tag}</span>}
                        </div>
                        {model.info && <div className="model-info">{model.info}</div>}
                        <input type="radio" name="languageModel" value={model.id} checked={selectedModel === model.id} readOnly className="model-radio" />
                    </div>
                ))}
            </div> */}

            {/* Other Settings Buttons SECOND */}
             <div className="setting-group other-settings">
                 <button className="secondary-action-button">
                     <FaHistory className="setting-icon" /> Conversational History
                 </button>
                 {/* <button className="secondary-action-button">
                     <FaCog className="setting-icon" /> Advanced Settings
                 </button> */}
            </div>

             {/* Theme Toggle Button THIRD */}
             <div className="setting-group theme-toggle-group">
                <label className="setting-label">Appearance</label>
                <button onClick={toggleTheme} className="secondary-action-button theme-toggle-button">
                    {theme === 'light' ? <FaMoon /> : <FaSun /> }
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                </button>
             </div>

             {/* Account Settings Section with Logout Button */}
             <div className="setting-group account-settings-group">
                <label className="setting-label">Account</label>
                <p>{userEmail || 'N/A'}</p> {/* Display user email */}
                <button onClick={onLogout} className="logout-button primary-action-button">Logout</button> {/* Logout Button */}
            </div>


             {/* API Key Section REMOVED */}

            {/* Save Button REMOVED (save happens automatically on selection/toggle now) */}
            {/* <button onClick={handleSave} className="save-button primary-action-button">Save Settings</button> */}

            {/* Status Message */}
            {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
    );
}


export default Settings;