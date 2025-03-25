import React, { useRef, useEffect, useState, MouseEvent as ReactMouseEvent } from 'react';
import AstrolabeIcon from './icons/AstrolabeIcon';

interface ProspectingMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the political compass position type
interface PoliticalPosition {
  x: number; // Economic: -1 (left) to 1 (right)
  y: number; // Social: -1 (authoritarian) to 1 (libertarian)
}

const ProspectingMenu: React.FC<ProspectingMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState<string>('');
  const [politicalPosition, setPoliticalPosition] = useState<PoliticalPosition>({ x: 0, y: 0 });
  
  // Auto-resize the textarea when content changes
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to correctly calculate the new height
      textareaRef.current.style.height = 'auto';
      // Set the height to scrollHeight to fit the content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);
  
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
  
  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };
  
  // Handle click on the political compass
  const handleCompassClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;
    
    // Get the dimensions and position of the compass
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Calculate x and y position relative to the compass (from -1 to 1)
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1; // Invert Y axis so up is positive
    
    // Update the position state
    setPoliticalPosition({ 
      x: Math.max(-1, Math.min(1, x)), 
      y: Math.max(-1, Math.min(1, y)) 
    });
  };
  
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
          <p className="prospecting-menu-subtitle">Plot a course! Let us sail deftly through our future...</p>
          
          <div className="prospecting-menu-layout">
            <div className="prospecting-menu-input-area">
              <textarea
                ref={textareaRef}
                className="prospecting-text-input"
                value={inputText}
                onChange={handleTextChange}
                placeholder="How might we choose the best futures for ourselves?"
                rows={3}
              />
            </div>
            
            <div className="prospecting-details-area">
              <h3>Political Compass</h3>
              <div 
                className="political-compass"
                onClick={handleCompassClick}
              >
                <div className="compass-grid">
                  <div className="compass-axis horizontal"></div>
                  <div className="compass-axis vertical"></div>
                  
                  <div className="compass-label top">Libertarian</div>
                  <div className="compass-label bottom">Authoritarian</div>
                  <div className="compass-label left">Left</div>
                  <div className="compass-label right">Right</div>
                  
                  {/* Position marker */}
                  <div 
                    className="position-marker"
                    style={{
                      left: `${((politicalPosition.x + 1) / 2) * 100}%`,
                      top: `${((1 - politicalPosition.y) / 2) * 100}%`
                    }}
                  ></div>
                </div>
                
                <div className="compass-coordinates">
                  X: {politicalPosition.x.toFixed(2)}, Y: {politicalPosition.y.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="prospecting-menu-options">
            <button className="side-option">Future</button>
            <button className="side-option">Coming</button>
            <button className="side-option">Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectingMenu; 