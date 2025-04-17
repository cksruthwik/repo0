// mindmap.jsx
import React from 'react';
import './MindMapper.css';
 
function MindMapper() {
 
  const handleGenerateMindmapClick = () => {
    // Use window.open to redirect to feuji.com in a new tab
    window.open('https://www.feuji.com', '_blank');
    console.log("Opening https://www.feuji.com in a new tab");
  };
 
  return (
    <div className="mindmapper-container">
      <h3>Mind Mapping</h3>
 
      <button
        className="update-button primary-action-button"
        onClick={handleGenerateMindmapClick}
      >
        Generate Mind Map
      </button>
 
      <p className="info-text">
        Click 'Generate Mind Map' to visit Feuji website in a new tab.
      </p>
    </div>
  );
}
 
export default MindMapper;