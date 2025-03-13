import React, { useRef, useEffect } from 'react';
import AstrolabeIcon from './icons/AstrolabeIcon';

interface ProspectingMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProspectingMenu: React.FC<ProspectingMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Handle click outside to close menu
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Prevent mouse events from propagating to prevent timeline grabbing
  const handleOverlayMouseDown = (e: React.MouseEvent) => {
    // Only stop propagation if clicking on the overlay background (not the menu)
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };
  
  // Prevent propagation of mouse events within the menu itself
  const handleMenuMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="prospecting-menu-overlay"
      onMouseDown={handleOverlayMouseDown}
    >
      <div 
        className="prospecting-menu-container" 
        ref={menuRef}
        onMouseDown={handleMenuMouseDown}
      >
        <div className="prospecting-menu-header">
          <h2 className="prospecting-menu-title">Prospecting Menu</h2>
        </div>
        
        <div className="prospecting-menu-banner">
          <AstrolabeIcon className="astrolabe-icon-banner" />
        </div>
        
        <div className="prospecting-menu-content">
          <p className="prospecting-menu-subtitle">Let's plot a course to sail deftly through our future...</p>
          
          <div className="prospecting-menu-layout">
            <div className="prospecting-menu-input-area">
              <div className="text-input-placeholder">
                <p>How might we choose the best futures for ourselves?</p>
              </div>
            </div>
            
            <div className="prospecting-details-area">
              <h3>More Details Coming Soon!</h3>
              <div className="pol-spectrum">
                <p>&lt;Pol. Spectrum&gt;</p>
              </div>
            </div>
          </div>
          
          <div className="prospecting-menu-options">
            <button className="side-option">Side option 1</button>
            <button className="side-option">Side option 2</button>
            <button className="side-option">Side option 3</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectingMenu; 