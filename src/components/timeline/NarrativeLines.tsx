import React from 'react';

interface NarrativeLinesProps {
  milestoneId: string;
}

/**
 * Component to display narrative lines an event participates in
 */
const NarrativeLines: React.FC<NarrativeLinesProps> = ({ milestoneId }) => {
  // Mock narrative lines - in a real app, these would come from props or context
  const narrativeLines = [
    { id: 'n1', name: 'AGI Development', relevance: 0.75, color: '#4CC9F0' },
    { id: 'n2', name: 'Global Regulation', relevance: 0.45, color: '#F72585' },
    { id: 'n3', name: 'AI Safety Research', relevance: 0.8, color: '#7209B7' },
    { id: 'n4', name: 'Compute Infrastructure', relevance: 0.35, color: '#3A0CA3' },
  ];
  
  return (
    <div className="narrative-lines-container">
      <h4 className="narrative-lines-title">Narrative Lines</h4>
      <div className="narrative-lines-list">
        {narrativeLines.map(line => (
          <div key={line.id} className="narrative-line-item">
            <span className="narrative-line-name">{line.name}</span>
            <div className="narrative-bar-container">
              <div 
                className="narrative-bar" 
                style={{ 
                  width: `${line.relevance * 100}%`,
                  backgroundColor: line.color 
                }}
                title={`Relevance: ${Math.round(line.relevance * 100)}%`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NarrativeLines; 