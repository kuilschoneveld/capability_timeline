import React from 'react';
import { ThematicTags } from '../../types';

interface PieChartProps {
  data: ThematicTags;
  size?: number;
}

/**
 * SVG Pie Chart component to visualize thematic dimensions
 */
const PieChart: React.FC<PieChartProps> = ({ data, size = 110 }) => {
  // Extract the three primary dimensions
  const technical = data.technical || 0;
  const societal = data.societal || 0;
  const philosophical = data.philosophical || 0;
  
  // Calculate the total for percentages
  const total = technical + societal + philosophical;
  
  // If total is zero, show empty chart
  if (total === 0) {
    return (
      <div 
        className="pie-chart-container"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <div className="empty-chart">No data</div>
      </div>
    );
  }
  
  // Calculate percentages for each segment
  const technicalPercent = (technical / total) * 100;
  const societalPercent = (societal / total) * 100;
  const philosophicalPercent = (philosophical / total) * 100;
  
  // Calculate angles for SVG paths
  const technicalDegrees = (technicalPercent / 100) * 360;
  const societalDegrees = (societalPercent / 100) * 360;
  // The philosophical degrees are calculated from the remaining angle
  
  // Calculate the SVG paths for each segment
  const radius = size / 2;
  const center = size / 2;
  
  // Calculate positions on the circle for each segment
  const getCoordinatesForPercent = (percent: number) => {
    const x = center + radius * Math.cos(Math.PI * 2 * percent - Math.PI / 2);
    const y = center + radius * Math.sin(Math.PI * 2 * percent - Math.PI / 2);
    return [x, y];
  };
  
  // Define the colors for each segment
  const colors = {
    technical: '#4CC9F0', // Blue for technical
    societal: '#F72585',  // Pink for societal
    philosophical: '#7209B7' // Purple for philosophical
  };
  
  // Generate the SVG paths for each segment
  let currentPercent = 0;
  
  // Technical segment
  const technicalPath = () => {
    if (technicalPercent === 0) return null;
    const techPercent = technicalPercent / 100;
    const [startX, startY] = getCoordinatesForPercent(currentPercent);
    currentPercent += techPercent;
    const [endX, endY] = getCoordinatesForPercent(currentPercent);
    const largeArcFlag = techPercent > 0.5 ? 1 : 0;
    
    return (
      <path
        d={`
          M ${center} ${center}
          L ${startX} ${startY}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
          Z
        `}
        fill={colors.technical}
        className="pie-segment technical-segment"
        data-value={`Technical: ${technical}/10`}
      />
    );
  };
  
  // Societal segment
  const societalPath = () => {
    if (societalPercent === 0) return null;
    const socPercent = societalPercent / 100;
    const [startX, startY] = getCoordinatesForPercent(currentPercent);
    currentPercent += socPercent;
    const [endX, endY] = getCoordinatesForPercent(currentPercent);
    const largeArcFlag = socPercent > 0.5 ? 1 : 0;
    
    return (
      <path
        d={`
          M ${center} ${center}
          L ${startX} ${startY}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
          Z
        `}
        fill={colors.societal}
        className="pie-segment societal-segment"
        data-value={`Societal: ${societal}/10`}
      />
    );
  };
  
  // Philosophical segment
  const philosophicalPath = () => {
    if (philosophicalPercent === 0) return null;
    const philPercent = philosophicalPercent / 100;
    const [startX, startY] = getCoordinatesForPercent(currentPercent);
    currentPercent += philPercent;
    const [endX, endY] = getCoordinatesForPercent(currentPercent);
    const largeArcFlag = philPercent > 0.5 ? 1 : 0;
    
    return (
      <path
        d={`
          M ${center} ${center}
          L ${startX} ${startY}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
          Z
        `}
        fill={colors.philosophical}
        className="pie-segment philosophical-segment"
        data-value={`Philosophical: ${philosophical}/10`}
      />
    );
  };
  
  return (
    <div className="pie-chart-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {technicalPath()}
        {societalPath()}
        {philosophicalPath()}
        <circle
          cx={center}
          cy={center}
          r={radius / 4}
          fill="#0A1B29"
          className="pie-center"
        />
      </svg>
      <div className="pie-chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: colors.technical }}></span>
          <span className="legend-label">Technical: {technical}/10</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: colors.societal }}></span>
          <span className="legend-label">Societal: {societal}/10</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: colors.philosophical }}></span>
          <span className="legend-label">Philosophical: {philosophical}/10</span>
        </div>
      </div>
    </div>
  );
};

export default PieChart; 