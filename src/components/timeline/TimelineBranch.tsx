import React from 'react';
import { Milestone, TimelineBranch as TimelineBranchType } from '../../types';
import TimelineItem from './TimelineItem';

interface TimelineBranchProps {
  branch: TimelineBranchType;
  milestones: Milestone[];
  expandedMilestoneId: string | null;
  onToggleExpand: (id: string) => void;
}

/**
 * Component to display a branch of the timeline with its milestones
 */
const TimelineBranch: React.FC<TimelineBranchProps> = ({
  branch,
  milestones,
  expandedMilestoneId,
  onToggleExpand
}) => {
  // Sort milestones by date
  const sortedMilestones = [...milestones].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Prevent drag events from interfering with timeline item clicks
  const handleItemsClick = (e: React.MouseEvent) => {
    if (e.target && (e.target as Element).closest('.timeline-item')) {
      // Don't stop propagation for clicks inside items as they need to bubble to the item itself
      // But do stop propagation to the parent container to prevent drag
      e.stopPropagation();
    }
  };

  return (
    <div className={`timeline-branch ${branch.isMainTimeline ? 'main-timeline' : 'branch-timeline'}`}>
      <div className="timeline-branch-header">
        <h2 className="timeline-branch-title">{branch.name}</h2>
        <p className="timeline-branch-description">{branch.description}</p>
      </div>
      
      <div className="timeline-branch-content">
        {/* Timeline line/connector */}
        <div className="timeline-connector" />
        
        {/* Timeline items */}
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
        </div>
      </div>
    </div>
  );
};

export default TimelineBranch; 