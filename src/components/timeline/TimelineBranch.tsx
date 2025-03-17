import React from 'react';
import { Milestone, TimelineBranch as TimelineBranchType } from '../../types';
import TimelineItem from './TimelineItem';
import timelineEvents from '../../data/timelineDatabase';

interface TimelineBranchProps {
  branch: TimelineBranchType;
  milestones: Milestone[];
  expandedMilestoneId: string | null;
  onToggleExpand: (id: string) => void;
  hideTitle?: boolean; // Optional prop to hide the title
}

/**
 * Component to display a branch of the timeline with its milestones
 */
const TimelineBranch: React.FC<TimelineBranchProps> = ({
  branch,
  milestones,
  expandedMilestoneId,
  onToggleExpand,
  hideTitle = false // Default to showing the title
}) => {
  // Sort milestones by date
  const sortedMilestones = [...milestones].sort((a, b) => {
    // Handle BCE dates (negative years) correctly
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    // For BCE dates (starting with '-'), we need special handling
    if (a.date.startsWith('-') && b.date.startsWith('-')) {
      // Both are BCE - earlier BCE dates should come first (larger negative year)
      return dateB.getTime() - dateA.getTime();
    } else if (a.date.startsWith('-')) {
      // Only A is BCE, it should come first
      return -1;
    } else if (b.date.startsWith('-')) {
      // Only B is BCE, it should come first
      return 1;
    }
    
    // Standard date comparison for CE dates
    return dateA.getTime() - dateB.getTime();
  });

  // Prevent parent drag events when interacting with timeline items
  const handleItemsClick = (e: React.MouseEvent) => {
    if (e.target && (e.target as Element).closest('.timeline-item')) {
      e.stopPropagation();
    }
  };

  return (
    <div className={`timeline-branch ${branch.isMainTimeline ? 'main-timeline' : 'branch-timeline'}`}>
      {!hideTitle && (
        <div className="timeline-branch-header">
          <h2 className="timeline-branch-title">{branch.name}</h2>
          <p className="timeline-branch-description">{branch.description}</p>
        </div>
      )}
      
      <div className="timeline-branch-content">
        {/* Timeline line/connector */}
        <div className="timeline-connector" />
        
        {/* Timeline items displayed horizontally */}
        <div className="timeline-items" onClick={handleItemsClick}>
          {sortedMilestones.map(milestone => (
            <TimelineItem
              key={milestone.id}
              milestone={milestone}
              isExpanded={expandedMilestoneId === milestone.id}
              onToggleExpand={onToggleExpand}
            />
          ))}
          
          {sortedMilestones.length === 0 && (
            <div className="timeline-empty-message">
              No milestones available for this branch.
            </div>
          )}
          
          {/* Add spacer at the end to ensure telescope button visibility */}
          <div className="timeline-end-spacer"></div>
        </div>
      </div>
    </div>
  );
};

export default TimelineBranch; 