import React from 'react';

interface NetworkConnectionProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isHighlighted: boolean;
  isSelected: boolean;
  branchColor: string;
  strokeWidth?: number;
}

/**
 * Component for rendering an SVG connection between two nodes in the networked timeline
 */
const NetworkConnection: React.FC<NetworkConnectionProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  isHighlighted,
  isSelected,
  branchColor,
  strokeWidth = 2
}) => {
  // Calculate the adjusted stroke width based on highlight/selection state
  const adjustedStrokeWidth = isSelected 
    ? strokeWidth * 2 
    : isHighlighted 
      ? strokeWidth * 1.5 
      : strokeWidth;
      
  // Calculate the color opacity based on state
  const colorOpacity = isSelected 
    ? '1' 
    : isHighlighted 
      ? '0.8' 
      : '0.5';
  
  // Add arrow marker for highlighted connections
  const markerId = `arrow-${branchColor.replace('#', '')}-${isHighlighted ? 'highlighted' : 'normal'}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine if we should use a curved path for connections with significant vertical difference
  const useCurvedPath = Math.abs(targetY - sourceY) > 50;
  
  // Create path data
  const generatePathData = () => {
    if (useCurvedPath) {
      // Calculate control points for a smooth curve
      const midX = (sourceX + targetX) / 2;
      return `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`;
    } else {
      // For smaller vertical differences, use a straight line
      return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    }
  };
  
  return (
    <svg 
      className="network-connection" 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: isSelected ? 25 : isHighlighted ? 15 : 5,
        overflow: 'visible' // Ensure the SVG can draw outside its bounds
      }}
    >
      <defs>
        {isHighlighted && (
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path 
              d="M 0 0 L 10 5 L 0 10 z" 
              fill={branchColor} 
              opacity={colorOpacity}
            />
          </marker>
        )}
      </defs>
      
      <path
        d={generatePathData()}
        stroke={branchColor}
        strokeWidth={adjustedStrokeWidth}
        fill="none"
        opacity={colorOpacity}
        strokeDasharray={isHighlighted ? "none" : "5,5"}
        markerEnd={isHighlighted ? `url(#${markerId})` : undefined}
        style={{
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}
      />
    </svg>
  );
};

export default NetworkConnection; 