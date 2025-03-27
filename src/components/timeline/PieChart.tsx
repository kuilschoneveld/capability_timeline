import React from 'react';

// Define the impact object structure
interface ImpactObject {
  technical: number;
  societal: number;
  philosophical: number;
  economic: number;
  geopolitical: number;
  [key: string]: number;
}

interface PieChartProps {
  data: ImpactObject;
  size?: number;
}

/**
 * SVG Pie Chart component to visualize impact dimensions
 */
const PieChart: React.FC<PieChartProps> = ({ data, size = 110 }) => {
  // Extract all five dimensions
  const technical = data.technical || 0;
  const societal = data.societal || 0;
  const philosophical = data.philosophical || 0;
  const economic = data.economic || 0;
  const geopolitical = data.geopolitical || 0;
  
  // Calculate the total for percentages
  const total = technical + societal + philosophical + economic + geopolitical;
  
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
  const economicPercent = (economic / total) * 100;
  const geopoliticalPercent = (geopolitical / total) * 100;
  
  // Calculate angles for SVG paths
  const technicalDegrees = (technicalPercent / 100) * 360;
  const societalDegrees = (societalPercent / 100) * 360;
  const philosophicalDegrees = (philosophicalPercent / 100) * 360;
  const economicDegrees = (economicPercent / 100) * 360;
  // The geopolitical degrees are calculated from the remaining angle
  
  // Calculate the SVG paths for each segment
  const radius = size / 2;
  const center = size / 2;
  
  // Calculate positions on the circle for each segment
  const getCoordinatesForPercent = (percent: number) => {
    const x = center + radius * Math.cos(Math.PI * 2 * percent - Math.PI / 2);
    const y = center + radius * Math.sin(Math.PI * 2 * percent - Math.PI / 2);
    return [x, y];
  };
  
  // Calculate positions for labels inside each segment
  const getTextPosition = (startPercent: number, endPercent: number) => {
    const midPercent = startPercent + (endPercent - startPercent) / 2;
    // Position text at 70% of the radius from center 
    const x = center + (radius * 0.7) * Math.cos(Math.PI * 2 * midPercent - Math.PI / 2);
    const y = center + (radius * 0.7) * Math.sin(Math.PI * 2 * midPercent - Math.PI / 2);
    return [x, y];
  };
  
  // Define the colors for each segment
  const colors = {
    technical: '#4CC9F0', // Blue for technical
    societal: '#F72585',  // Pink for societal
    philosophical: '#7209B7', // Purple for philosophical
    economic: '#3A0CA3', // Dark blue for economic
    geopolitical: '#F49D37' // Orange for geopolitical
  };

  // Define abbreviations for each category
  const abbreviations = {
    technical: 'Tech',
    societal: 'Soc',
    philosophical: 'Phil',
    economic: 'Econ',
    geopolitical: 'Geo'
  };
  
  // Create tooltip text for the center circle
  const tooltipText = `Technical: ${technical}/10
Societal: ${societal}/10
Philosophical: ${philosophical}/10
Economic: ${economic}/10
Geopolitical: ${geopolitical}/10`;
  
  // Generate the SVG paths for each segment
  let currentPercent = 0;
  
  // Technical segment
  const technicalPath = () => {
    if (technicalPercent === 0) return null;
    const techPercent = technicalPercent / 100;
    const [startX, startY] = getCoordinatesForPercent(currentPercent);
    const startPercentTemp = currentPercent;
    currentPercent += techPercent;
    const [endX, endY] = getCoordinatesForPercent(currentPercent);
    const largeArcFlag = techPercent > 0.5 ? 1 : 0;
    const [textX, textY] = getTextPosition(startPercentTemp, currentPercent);
    
    return (
      <>
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
        {technicalPercent > 10 && (
          <text 
            x={textX} 
            y={textY} 
            fill="white" 
            fontSize="9" 
            textAnchor="middle" 
            dominantBaseline="middle"
            className="pie-segment-label"
          >
            {abbreviations.technical}
          </text>
        )}
      </>
    );
  };
  
  // Societal segment
  const societalPath = () => {
    if (societalPercent === 0) return null;
    const socPercent = societalPercent / 100;
    const [startX, startY] = getCoordinatesForPercent(currentPercent);
    const startPercentTemp = currentPercent;
    currentPercent += socPercent;
    const [endX, endY] = getCoordinatesForPercent(currentPercent);
    const largeArcFlag = socPercent > 0.5 ? 1 : 0;
    const [textX, textY] = getTextPosition(startPercentTemp, currentPercent);
    
    return (
      <>
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
        {societalPercent > 10 && (
          <text 
            x={textX} 
            y={textY} 
            fill="white" 
            fontSize="9" 
            textAnchor="middle" 
            dominantBaseline="middle"
            className="pie-segment-label"
          >
            {abbreviations.societal}
          </text>
        )}
      </>
    );
  };
  
  // Philosophical segment
  const philosophicalPath = () => {
    if (philosophicalPercent === 0) return null;
    const philPercent = philosophicalPercent / 100;
    const [startX, startY] = getCoordinatesForPercent(currentPercent);
    const startPercentTemp = currentPercent;
    currentPercent += philPercent;
    const [endX, endY] = getCoordinatesForPercent(currentPercent);
    const largeArcFlag = philPercent > 0.5 ? 1 : 0;
    const [textX, textY] = getTextPosition(startPercentTemp, currentPercent);
    
    return (
      <>
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
        {philosophicalPercent > 10 && (
          <text 
            x={textX} 
            y={textY} 
            fill="white" 
            fontSize="9" 
            textAnchor="middle" 
            dominantBaseline="middle"
            className="pie-segment-label"
          >
            {abbreviations.philosophical}
          </text>
        )}
      </>
    );
  };
  
  // Economic segment
  const economicPath = () => {
    if (economicPercent === 0) return null;
    const econPercent = economicPercent / 100;
    const [startX, startY] = getCoordinatesForPercent(currentPercent);
    const startPercentTemp = currentPercent;
    currentPercent += econPercent;
    const [endX, endY] = getCoordinatesForPercent(currentPercent);
    const largeArcFlag = econPercent > 0.5 ? 1 : 0;
    const [textX, textY] = getTextPosition(startPercentTemp, currentPercent);
    
    return (
      <>
        <path
          d={`
            M ${center} ${center}
            L ${startX} ${startY}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
            Z
          `}
          fill={colors.economic}
          className="pie-segment economic-segment"
          data-value={`Economic: ${economic}/10`}
        />
        {economicPercent > 10 && (
          <text 
            x={textX} 
            y={textY} 
            fill="white" 
            fontSize="9" 
            textAnchor="middle" 
            dominantBaseline="middle"
            className="pie-segment-label"
          >
            {abbreviations.economic}
          </text>
        )}
      </>
    );
  };
  
  // Geopolitical segment
  const geopoliticalPath = () => {
    if (geopoliticalPercent === 0) return null;
    const geoPercent = geopoliticalPercent / 100;
    const [startX, startY] = getCoordinatesForPercent(currentPercent);
    const startPercentTemp = currentPercent;
    currentPercent += geoPercent;
    const [endX, endY] = getCoordinatesForPercent(currentPercent);
    const largeArcFlag = geoPercent > 0.5 ? 1 : 0;
    const [textX, textY] = getTextPosition(startPercentTemp, currentPercent);
    
    return (
      <>
        <path
          d={`
            M ${center} ${center}
            L ${startX} ${startY}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
            Z
          `}
          fill={colors.geopolitical}
          className="pie-segment geopolitical-segment"
          data-value={`Geopolitical: ${geopolitical}/10`}
        />
        {geopoliticalPercent > 10 && (
          <text 
            x={textX} 
            y={textY} 
            fill="white" 
            fontSize="9" 
            textAnchor="middle" 
            dominantBaseline="middle"
            className="pie-segment-label"
          >
            {abbreviations.geopolitical}
          </text>
        )}
      </>
    );
  };
  
  return (
    <div className="timeline-item-content-layout">
      <div className="pie-chart-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {technicalPath()}
          {societalPath()}
          {philosophicalPath()}
          {economicPath()}
          {geopoliticalPath()}
          <circle
            cx={center}
            cy={center}
            r={radius / 4}
            fill="white"
            className="pie-center"
          >
            <title>{tooltipText}</title>
          </circle>
        </svg>
      </div>
      <div className="placeholder-container">
        {/* Placeholder for right side content as requested */}
      </div>
    </div>
  );
};

export default PieChart; 