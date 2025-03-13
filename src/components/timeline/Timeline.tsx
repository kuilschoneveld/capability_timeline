// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useRef, useState, useEffect } from 'react';
import { useTimeline } from '../../hooks/useTimeline';
import TimelineBranch from './TimelineBranch';
import TimelineControls from './TimelineControls';

interface TimelineProps {
  showOptionsBox?: boolean;
}

/**
 * Main Timeline component that displays the entire timeline
 */
const Timeline: React.FC<TimelineProps> = ({ showOptionsBox = true }) => {
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
  
  // Track the expanded state for each branch separately for better positioning
  const [hasExpandedOptimistic, setHasExpandedOptimistic] = useState(false);
  const [hasExpandedPessimistic, setHasExpandedPessimistic] = useState(false);
  
  // Track the currently displayed year for the year indicator
  const [displayedYear, setDisplayedYear] = useState<string | null>(null);
  
  // Track the scroll position when a milestone is expanded
  const [expansionScrollPosition, setExpansionScrollPosition] = useState<number | null>(null);
  
  // Track how close we are to the scroll threshold (0-100%)
  const [scrollThresholdProgress, setScrollThresholdProgress] = useState(0);
  
  // Reference to the timeline container for visibility checking
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Group milestones by branch
  const milestonesByBranch = branches.reduce((acc, branch) => {
    acc[branch.id] = milestones.filter(m => m.branchId === branch.id);
    return acc;
  }, {} as Record<string, typeof milestones>);

  // Get main timeline branch and its milestones
  const mainBranch = branches.find(branch => branch.isMainTimeline);
  
  // Get future branches and separate them into optimistic and pessimistic
  const futureBranches = branches.filter(branch => !branch.isMainTimeline);
  
  // For demo purposes, we'll consider the first future branch as optimistic and the second as pessimistic
  // In a real app, this would be determined by branch metadata
  const optimisticBranch = futureBranches.length > 0 ? futureBranches[0] : null;
  const pessimisticBranch = futureBranches.length > 1 ? futureBranches[1] : null;
  
  // Get branch point date - the date when timeline branches
  const branchPointDate = futureBranches.length > 0 && futureBranches[0].startDate 
    ? futureBranches[0].startDate 
    : new Date().toISOString();
  
  // Get milestones before branch point (on main branch)
  const milestonesBeforeBranchPoint = mainBranch 
    ? milestonesByBranch[mainBranch.id]?.filter(
      milestone => new Date(milestone.date) < new Date(branchPointDate)
    )
    : [];
    
  // Update expanded state for branches whenever expandedMilestoneId changes
  useEffect(() => {
    if (!expandedMilestoneId) {
      setHasExpandedOptimistic(false);
      setHasExpandedPessimistic(false);
      setDisplayedYear(null);
      setExpansionScrollPosition(null);
      return;
    }
    
    // Find the expanded milestone to get its year
    const expandedMilestone = milestones.find(m => m.id === expandedMilestoneId);
    if (expandedMilestone) {
      const date = new Date(expandedMilestone.date);
      setDisplayedYear(date.getFullYear().toString());
      
      // Store the current scroll position when a milestone is expanded
      const parentContainer = document.querySelector('.App-main');
      if (parentContainer) {
        setExpansionScrollPosition(parentContainer.scrollLeft);
      }
    }
    
    // Check if expanded milestone is in optimistic branch
    if (optimisticBranch && milestonesByBranch[optimisticBranch.id]) {
      setHasExpandedOptimistic(
        milestonesByBranch[optimisticBranch.id].some(m => m.id === expandedMilestoneId)
      );
    }
    
    // Check if expanded milestone is in pessimistic branch
    if (pessimisticBranch && milestonesByBranch[pessimisticBranch.id]) {
      setHasExpandedPessimistic(
        milestonesByBranch[pessimisticBranch.id].some(m => m.id === expandedMilestoneId)
      );
    }
  }, [expandedMilestoneId, milestones, milestonesByBranch, optimisticBranch, pessimisticBranch]);

  // Check if user has scrolled beyond the threshold to close the expanded milestone
  useEffect(() => {
    if (!expandedMilestoneId || expansionScrollPosition === null) return;

    const handleScroll = () => {
      const parentContainer = document.querySelector('.App-main');
      if (!parentContainer) return;
      
      const currentScrollPosition = parentContainer.scrollLeft;
      const scrollDistance = Math.abs(currentScrollPosition - expansionScrollPosition);
      
      // Define a scroll threshold based on a percentage of viewport width
      const viewportWidth = window.innerWidth;
      const scrollThreshold = viewportWidth * 0.3; // 30% of viewport width
      
      // Calculate and update progress toward threshold (as a percentage)
      const progress = Math.min(100, Math.round((scrollDistance / scrollThreshold) * 100));
      setScrollThresholdProgress(progress);
      
      // If scrolled beyond threshold, close the expanded milestone
      if (scrollDistance > scrollThreshold) {
        // Before closing, smoothly scroll to the current position to prevent jumps
        const expandedElement = document.querySelector(`[data-milestone-id="${expandedMilestoneId}"][data-expanded="true"]`);
        if (expandedElement) {
          const rect = expandedElement.getBoundingClientRect();
          const elementCenterX = rect.left + rect.width / 2;
          const viewportCenterX = window.innerWidth / 2;
          
          // If the element is not centered, center it smoothly
          if (Math.abs(elementCenterX - viewportCenterX) > 50) {
            const scrollAdjustment = elementCenterX - viewportCenterX;
            parentContainer.scrollBy({
              left: scrollAdjustment,
              behavior: 'smooth'
            });
            
            // Give time for the scroll animation before closing
            setTimeout(() => {
              setDisplayedYear(null);
              toggleMilestoneExpansion(expandedMilestoneId);
              setScrollThresholdProgress(0);
            }, 150);
            return;
          }
        }
        
        // If no element found or element is already centered, close immediately
        setDisplayedYear(null);
        toggleMilestoneExpansion(expandedMilestoneId);
        setScrollThresholdProgress(0);
        return;
      }
      
      // Backup check: Also close if the milestone is completely out of view
      const expandedElement = document.querySelector(`[data-milestone-id="${expandedMilestoneId}"][data-expanded="true"]`);
      if (expandedElement) {
        const rect = expandedElement.getBoundingClientRect();
        const containerRect = parentContainer.getBoundingClientRect();
        
        const isCompletelyOutOfView = (
          rect.right < containerRect.left ||
          rect.left > containerRect.right
        );
        
        if (isCompletelyOutOfView) {
          setDisplayedYear(null);
          toggleMilestoneExpansion(expandedMilestoneId);
          setScrollThresholdProgress(0);
        }
      }
    };
    
    // Listen for scroll events on the parent container
    const parentContainer = document.querySelector('.App-main');
    if (parentContainer) {
      parentContainer.addEventListener('scroll', handleScroll, { passive: true });
      
      // Initial check
      handleScroll();
    }
    
    return () => {
      if (parentContainer) {
        parentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [expandedMilestoneId, expansionScrollPosition, toggleMilestoneExpansion]);

  // Generate dynamic classes for branches based on expansion state
  const getOptimisticClassName = () => {
    return `future-branch optimistic-branch ${hasExpandedOptimistic ? 'has-expanded' : ''}`;
  };
  
  const getPessimisticClassName = () => {
    return `future-branch pessimistic-branch ${hasExpandedPessimistic ? 'has-expanded' : ''}`;
  };
  
  // Generate class for the timeline content based on expanded branches
  const getTimelineContentClassName = () => {
    const baseClass = 'timeline-content';
    if (hasExpandedOptimistic && hasExpandedPessimistic) {
      return `${baseClass} both-expanded`;
    } else if (hasExpandedOptimistic || hasExpandedPessimistic) {
      return `${baseClass} one-expanded`;
    }
    return baseClass;
  };

  return (
    <div className="timeline-container" ref={timelineContainerRef}>
      {/* Options box fixed in the top left corner - only display when showOptionsBox is true */}
      {showOptionsBox && (
        <div className="timeline-options-box">
          <h3>Further Options</h3>
          <p>for searching, comparing milestone metrics, or engaging with the future tradeoffs and decisions.</p>
        </div>
      )}
      
      {/* Timeline controls - hidden visually but maintain functionality */}
      <div className="timeline-controls-hidden">
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
      </div>
      
      {/* Loading and error states */}
      {loading && <div className="timeline-loading">Loading timeline data...</div>}
      {error && <div className="timeline-error">Error: {error}</div>}
      
      <div className={getTimelineContentClassName()}>
        {/* Historical section label */}
        <div className="timeline-section-label historical-label">Historical</div>
        
        <div className="timeline-layout">
          {/* Historical timeline section */}
          <div className="historical-timeline-section">
            {mainBranch && (
              <TimelineBranch
                key={mainBranch.id}
                branch={mainBranch}
                milestones={milestonesBeforeBranchPoint}
                expandedMilestoneId={expandedMilestoneId}
                onToggleExpand={toggleMilestoneExpansion}
              />
            )}
          </div>
          
          {/* Branch point connecting historical to future */}
          <div className="branch-point-connector">
            <div className="show-future-button-container">
              <button 
                className="show-future-branches-button" 
                onClick={toggleBranchVisibility}
              >
                {filter.showBranches ? 'Hide Future' : 'Show Future'}
              </button>
            </div>
          </div>
          
          {/* Future timelines section - only visible when toggled */}
          {filter.showBranches && (
            <div className="future-timelines-section">
              {/* Future branch paths section */}
              <div className="future-paths-container">
                {/* Optimistic branch */}
                {optimisticBranch && (
                  <div className={getOptimisticClassName()}>
                    <TimelineBranch
                      key={optimisticBranch.id}
                      branch={optimisticBranch}
                      milestones={milestonesByBranch[optimisticBranch.id] || []}
                      expandedMilestoneId={expandedMilestoneId}
                      onToggleExpand={toggleMilestoneExpansion}
                    />
                  </div>
                )}
                
                {/* Pessimistic branch */}
                {pessimisticBranch && (
                  <div className={getPessimisticClassName()}>
                    <TimelineBranch
                      key={pessimisticBranch.id}
                      branch={pessimisticBranch}
                      milestones={milestonesByBranch[pessimisticBranch.id] || []}
                      expandedMilestoneId={expandedMilestoneId}
                      onToggleExpand={toggleMilestoneExpansion}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Empty state */}
        {!loading && milestones.length === 0 && (
          <div className="timeline-empty">
            <p>No milestones found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
      
      {/* Year indicator at the bottom */}
      <div 
        className={`year-indicator ${displayedYear ? 'has-year' : 'no-year'} ${
          scrollThresholdProgress > 0 ? 'closing-progress' : ''
        }`} 
        style={
          scrollThresholdProgress > 0 ? 
          { '--closing-progress': `${scrollThresholdProgress}%` } as React.CSSProperties : 
          undefined
        }
      >
        {displayedYear ? (
          <div className="year-indicator-content">{displayedYear}</div>
        ) : (
          <div className="year-indicator-content">Year</div>
        )}
        {scrollThresholdProgress > 0 && (
          <div className="closing-progress-indicator" />
        )}
      </div>
    </div>
  );
};

export default Timeline; 