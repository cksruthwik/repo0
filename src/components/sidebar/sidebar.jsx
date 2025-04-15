import React from 'react';
import './Sidebar.css';

// --- Use the same icons you liked before ---
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { FiShare2 } from 'react-icons/fi'; // MindMap placeholder
import { IoSettingsOutline } from 'react-icons/io5';

// Prop name changed to 'viewDefinitions' for clarity
function Sidebar({ activeView, setActiveView, viewDefinitions, isOpen, toggleSidebar }) {

    // Use the passed 'viewDefinitions' object
    const icons = {
        [viewDefinitions.CHATBOT]: <IoChatbubbleEllipsesOutline />,
        [viewDefinitions.SUMMARIZER]: <HiOutlineDocumentText />,
        [viewDefinitions.MIND_MAP]: <FiShare2 />,
        [viewDefinitions.SETTINGS]: <IoSettingsOutline />,
    };

    // Map using the view *labels* ('Chat Bot', etc.) from the definitions
    const navItems = Object.values(viewDefinitions).map((label) => ({
        id: label, // Use label as the key/id
        label: label,
        icon: icons[label] || null // Get icon using the label
    }));

    // Close sidebar when an item is clicked
    const handleItemClick = (viewId) => {
        setActiveView(viewId);
        if (isOpen) {
            toggleSidebar();
        }
    };

    return (
        // Use 'isOpen' prop for the 'open' class
        <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Container for the actual buttons/background */}
            <div className="sidebar-button-container">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-button ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => handleItemClick(item.id)}
                        title={item.label}
                    >
                        {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                        <span className="sidebar-label">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}

export default Sidebar;