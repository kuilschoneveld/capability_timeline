import React, { useRef, useState, useEffect } from 'react';
import { TimelineViewMode } from '../../types';
import { useTimeline } from '../../hooks/useTimeline';
import TimelineBranch from './TimelineBranch';
import TimelineControls from './TimelineControls';

/**
 * Main Timeline component that displays the entire timeline
 */
const Timeline: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
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

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't handle drag if clicking on a timeline item
    if ((e.target as Element).closest('.timeline-item')) {
      console.log('Click on timeline item - not starting drag');
      return;
    }
    
    // Start a timer to detect if this is a click or a drag
    const dragTimer = setTimeout(() => {
      setIsDragging(true);
      setDragStartX(e.clientX);
      setScrollLeft(timelineRef.current?.scrollLeft || 0);
    }, 150); // Short delay to distinguish between click and drag
    
    // Store the timer so we can clear it
    (window as any).dragTimer = dragTimer;
    
    // Prevent default behavior while dragging
    e.preventDefault();
  };

  // Handle drag movement
  const handleMouseMove = (e: React.MouseEvent) => {
    // Clear the timer if mouse moves before timer expires (real drag, not click)
    if ((window as any).dragTimer) {
      clearTimeout((window as any).dragTimer);
      (window as any).dragTimer = null;
      setIsDragging(true);
      setDragStartX(e.clientX);
      setScrollLeft(timelineRef.current?.scrollLeft || 0);
    }
    
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = scrollLeft - deltaX;
    }
    
    e.preventDefault();
  };

  // Handle drag end
  const handleMouseUp = () => {
    // Clear any pending drag timer
    if ((window as any).dragTimer) {
      clearTimeout((window as any).dragTimer);
      (window as any).dragTimer = null;
    }
    
    setIsDragging(false);
  };

  // Handle mouse leave to end dragging if cursor leaves the element
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Add global event listener for mouseup to handle cases where mouse is released outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);
  
  // Get main timeline branch and its milestones
  const mainBranch = branches.find(branch => branch.isMainTimeline);
  const mainBranchMilestones = mainBranch ? milestonesByBranch[mainBranch.id] || [] : [];
  
  // Find the future branches and determine branch point
  const futureBranches = branches.filter(branch => !branch.isMainTimeline);
  const branchPointDate = futureBranches.length > 0 && futureBranches[0].startDate 
    ? futureBranches[0].startDate 
    : '2025-01-01';
  
  // Sort main branch milestones by date
  const sortedMainMilestones = [...mainBranchMilestones].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // Find the milestone at which the timeline branches
  const milestonesBeforeBranchPoint = sortedMainMilestones.filter(
    milestone => new Date(milestone.date) < new Date(branchPointDate)
  );

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
      
      {/* Main timeline content - horizontal layout */}
      <div 
        ref={timelineRef}
        className={`timeline-content drag-mode ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="horizontal-timeline-wrapper">
          {/* Render main timeline branch */}
          {mainBranch && (
            <TimelineBranch
              key={mainBranch.id}
              branch={mainBranch}
              milestones={milestonesBeforeBranchPoint}
              expandedMilestoneId={expandedMilestoneId}
              onToggleExpand={toggleMilestoneExpansion}
            />
          )}
          
          {/* Show the future branches toggle button at the branch point */}
          <div className="future-branches-toggle">
            <div className="timeline-branch-point"></div>
            <button 
              className="show-future-branches-button" 
              onClick={toggleBranchVisibility}
            >
              {filter.showBranches ? 'Hide Future Branches' : 'Show Future Branches'}
            </button>
            <div className="timeline-branch-date">{branchPointDate}</div>
          </div>
          
          {/* Render future branches if showBranches is true */}
          {filter.showBranches && futureBranches.map(branch => (
            <TimelineBranch
              key={branch.id}
              branch={branch}
              milestones={milestonesByBranch[branch.id] || []}
              expandedMilestoneId={expandedMilestoneId}
              onToggleExpand={toggleMilestoneExpansion}
            />
          ))}
        </div>
        
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