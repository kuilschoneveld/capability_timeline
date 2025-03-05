import React from 'react';
import { Milestone } from '../../types';

interface TimelineItemProps {
  milestone: Milestone;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

/**
 * Component to display a single milestone in the timeline
 */
const TimelineItem: React.FC<TimelineItemProps> = ({ 
  milestone, 
  isExpanded, 
  onToggleExpand 
}) => {
  const { id, title, date, description, imageUrl, sourceUrls, thematicTags } = milestone;
  
  // Format the date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Handle click to expand/collapse
  const handleClick = () => {
    onToggleExpand(id);
  };
  
  return (
    <div 
      className={`timeline-item ${isExpanded ? 'expanded' : ''}`}
      onClick={handleClick}
      data-branch={milestone.branchId}
    >
      <div className="timeline-item-header">
        <div className="timeline-item-date">{formattedDate}</div>
        <h3 className="timeline-item-title">{title}</h3>
        {imageUrl && (
          <div className="timeline-item-image-container">
            <img 
              src={imageUrl} 
              alt={title} 
              className="timeline-item-image" 
            />
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="timeline-item-details">
          <p className="timeline-item-description">{description}</p>
          
          {/* Thematic tags visualization */}
          <div className="timeline-item-tags">
            {Object.entries(thematicTags).map(([tag, value]) => (
              <div key={tag} className="timeline-item-tag">
                <span className="tag-name">{tag}</span>
                <div className="tag-bar-container">
                  <div 
                    className="tag-bar" 
                    style={{ width: `${value * 10}%` }}
                    title={`${tag}: ${value}/10`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Source links if available */}
          {sourceUrls && sourceUrls.length > 0 && (
            <div className="timeline-item-sources">
              <h4>Sources:</h4>
              <ul>
                {sourceUrls.map((url, index) => (
                  <li key={index}>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Source {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimelineItem; 