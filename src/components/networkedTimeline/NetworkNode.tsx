import React from 'react';
import { TimelineNode } from '../../types/networkedTimeline';

interface NetworkNodeProps {
  node: TimelineNode;
  position: { left: number; top: number };
  isSelected: boolean;
  isHighlighted: boolean;
  branchColor: string;
  onClick: () => void;
}

/**
 * Component for rendering a single node in the networked timeline
 * With improved visual design and positioning
 */
const NetworkNode: React.FC<NetworkNodeProps> = ({
  node,
  position,
  isSelected,
  isHighlighted,
  branchColor,
  onClick
}) => {
  // Calculate a unique color intensity based on thematic tags
  const calculateColorIntensity = () => {
    const sum = Object.values(node.thematicTags).reduce((acc, val) => acc + val, 0);
    const avg = sum / Object.values(node.thematicTags).length;
    return Math.min(1, Math.max(0.3, avg / 10)); // Normalize between 0.3 and 1
  };
  
  // Adjust color brightness based on thematic importance
  const getAdjustedColor = () => {
    const intensity = calculateColorIntensity();
    
    // Parse the hex color into RGB
    const r = parseInt(branchColor.slice(1, 3), 16);
    const g = parseInt(branchColor.slice(3, 5), 16);
    const b = parseInt(branchColor.slice(5, 7), 16);
    
    // Adjust brightness based on intensity
    const adjustedR = Math.min(255, Math.round(r * intensity));
    const adjustedG = Math.min(255, Math.round(g * intensity));
    const adjustedB = Math.min(255, Math.round(b * intensity));
    
    return `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
  };
  
  // Node size
  const nodeSize = isSelected ? 120 : isHighlighted ? 110 : 100;
  
  return (
    <div
      className={`network-node ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        transform: 'translate(-50%, -50%)', // Center the node on its coordinates
        width: nodeSize,
        height: 'auto',
        zIndex: isSelected ? 30 : isHighlighted ? 20 : 10,
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        pointerEvents: 'auto', // Ensure the node can receive pointer events
        cursor: 'pointer'
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event from bubbling to background
        onClick();
      }}
    >
      {/* Node background with shadow and border */}
      <div 
        className="w-full rounded-lg p-3 shadow-md"
        style={{
          backgroundColor: isSelected 
            ? getAdjustedColor() 
            : `${getAdjustedColor()}${isHighlighted ? 'dd' : '99'}`, // Add transparency
          borderWidth: isSelected ? 2 : 1, 
          borderStyle: 'solid',
          borderColor: isHighlighted ? '#fff' : 'rgba(75, 85, 99, 0.6)',
          boxShadow: isSelected 
            ? `0 0 10px 2px ${getAdjustedColor()}80` 
            : isHighlighted 
              ? `0 0 5px 1px ${getAdjustedColor()}40`
              : 'none',
          transform: isSelected ? 'scale(1.05)' : isHighlighted ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}
      >
        <div className="flex flex-col">
          {/* Node header with title and date */}
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-white text-sm line-clamp-2 node-title">
              {node.title}
            </h3>
            <span className="text-xs text-gray-200 whitespace-nowrap ml-1 node-date">
              {formatDate(node.date)}
            </span>
          </div>
          
          {/* Node content - only show when selected or highlighted */}
          <div 
            className="mt-2 overflow-hidden transition-all node-description"
            style={{
              maxHeight: isSelected ? '80px' : isHighlighted ? '40px' : '0px',
              opacity: isSelected ? 1 : isHighlighted ? 0.8 : 0,
              transition: 'all 0.3s'
            }}
          >
            <p className="text-xs text-gray-200 line-clamp-3">{node.description}</p>
            
            {/* Thematic tags indicator dots */}
            {isSelected && (
              <div className="flex mt-2 justify-center space-x-1">
                {Object.entries(node.thematicTags).map(([key, value]) => (
                  <div 
                    key={key} 
                    className="tooltip-container"
                    title={`${key}: ${value}/10`}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: getDimensionColor(key),
                        opacity: value / 10
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Get a color for each thematic dimension
 */
const getDimensionColor = (dimension: string): string => {
  switch (dimension.toLowerCase()) {
    case 'technical':
      return '#3b82f6'; // blue
    case 'societal':
      return '#10b981'; // green
    case 'philosophical':
      return '#8b5cf6'; // purple
    default:
      return '#d1d5db'; // gray
  }
};

/**
 * Format a date string to a more readable format
 */
const formatDate = (dateString: string): string => {
  // Handle approximate dates (like '1970-01-01' for the 1970s)
  if (dateString.endsWith('-01-01')) {
    const year = new Date(dateString).getFullYear();
    if (dateString.substring(5, 7) === '01' && dateString.substring(8, 10) === '01') {
      return year.toString();
    }
  }
  
  // Format specific dates
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short',
    day: date.getDate() === 1 ? undefined : 'numeric' 
  });
};

export default NetworkNode; 