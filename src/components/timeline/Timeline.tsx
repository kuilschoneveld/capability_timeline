import React, { useRef } from 'react';
import { TimelineViewMode } from '../../types';
import { useTimeline } from '../../hooks/useTimeline';
import TimelineBranch from './TimelineBranch';
import TimelineControls from './TimelineControls';

/**
 * Main Timeline component that displays the entire timeline
 */
const Timeline: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const {
    milestones,
    branches,
    selectedBranch,
    expandedMilestoneId,
    loading,
    error,
    filter,
    viewMode,
    changeBranch,
    updateFilter,
    toggleMilestoneExpansion,
    changeViewMode,
    toggleBranchVisibility,
  } = useTimeline();

  // Group milestones by branch
  const milestonesByBranch = branches.reduce((acc, branch) => {
    acc[branch.id] = milestones.filter(m => m.branchId === branch.id);
    return acc;
  }, {} as Record<string, typeof milestones>);

  // Handle scroll/drag/zoom interactions based on view mode
  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== TimelineViewMode.DRAG) return;
    
    // Placeholder for drag functionality
    // This would be implemented in a future iteration
    console.log('Drag start:', e.clientX, e.clientY);
  };

  // Placeholder for zoom functionality
  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== TimelineViewMode.ZOOM) return;
    
    // Placeholder for zoom functionality
    // This would be implemented in a future iteration
    console.log('Zoom:', e.deltaY);
  };

  return (
    <div className="timeline-container">
      {/* Timeline controls */}
      <TimelineControls
        branches={branches}
        selectedBranch={selectedBranch}
        viewMode={viewMode}
        filter={filter}
        onChangeBranch={changeBranch}
        onChangeViewMode={changeViewMode}
        onUpdateFilter={updateFilter}
        onToggleBranchVisibility={toggleBranchVisibility}
      />
      
      {/* Loading and error states */}
      {loading && <div className="timeline-loading">Loading timeline data...</div>}
      {error && <div className="timeline-error">Error: {error}</div>}
      
      {/* Main timeline content */}
      <div 
        ref={timelineRef}
        className={`timeline-content ${viewMode.toLowerCase()}-mode`}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        {/* Render branches */}
        {branches
          .filter(branch => branch.isMainTimeline || filter.showBranches)
          .map(branch => (
            <TimelineBranch
              key={branch.id}
              branch={branch}
              milestones={milestonesByBranch[branch.id] || []}
              expandedMilestoneId={expandedMilestoneId}
              onToggleExpand={toggleMilestoneExpansion}
            />
          ))}
        
        {/* Empty state */}
        {!loading && milestones.length === 0 && (
          <div className="timeline-empty">
            <p>No milestones found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline; 