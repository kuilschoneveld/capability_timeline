// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useRef, useState, useEffect } from 'react';
import { useTimeline } from '../../hooks/useTimeline';
import TimelineBranch from './TimelineBranch';
import TimelineControls from './TimelineControls';
import TimelineExploreButton from './TimelineExploreButton';
import ProspectingMenu from '../ProspectingMenu';
import timelineEvents from '../../data/timelineDatabase';

interface TimelineProps {
  showOptionsBox?: boolean;
  onTimelineTitleChange?: (title: 'historical' | 'optimistic' | 'pessimistic' | 'future') => void;
}

/**
 * Main Timeline component that displays the entire timeline
 */
const Timeline: React.FC<TimelineProps> = ({ showOptionsBox = true, onTimelineTitleChange }) => {
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
  
  // Track if user has reached the end of the timeline
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  
  // Reference to the timeline container for visibility checking
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Group milestones by branch
  const milestonesByBranch = branches.reduce((acc, branch) => {
    acc[branch.id] = milestones.filter(m => m.branchId === branch.id);
    return acc;
  }, {} as Record<string, typeof milestones>);

  // Add console logging to see what data Timeline component is working with
  console.log("Timeline component data:");
  console.log("Branches:", branches);
  console.log("Milestones:", milestones);
  console.log("Milestones by branch:", milestonesByBranch);

  // Get main timeline branch and its milestones
  const mainBranch = branches.find(branch => branch.isMainTimeline);
  
  // Get future branches and separate them into optimistic and pessimistic
  const futureBranches = branches.filter(branch => !branch.isMainTimeline);
  console.log("Future branches:", futureBranches);
  
  // For demo purposes, we'll consider the first future branch as optimistic and the second as pessimistic
  // In a real app, this would be determined by branch metadata
  const optimisticBranch = futureBranches.find(branch => branch.id === 'future-optimistic');
  const pessimisticBranch = futureBranches.find(branch => branch.id === 'future-pessimistic');
  
  console.log("Optimistic branch:", optimisticBranch);
  console.log("Pessimistic branch:", pessimisticBranch);
  
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
    
  // Track if the prospecting menu is open
  const [menuOpen, setMenuOpen] = useState(false);
  
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

  // Detect when user has scrolled to the end of the timeline
  useEffect(() => {
    const parentContainer = document.querySelector('.App-main');
    if (!parentContainer) return;
    
    const handleScrollEnd = () => {
      const isAtEnd = parentContainer.scrollLeft + parentContainer.clientWidth >= parentContainer.scrollWidth - 50;
      setHasReachedEnd(isAtEnd);
    };
    
    // Add scroll event listener
    parentContainer.addEventListener('scroll', handleScrollEnd);
    
    // Initial check
    handleScrollEnd();
    
    // Clean up
    return () => {
      parentContainer.removeEventListener('scroll', handleScrollEnd);
    };
  }, []);

  // Handler for the explore button click
  const handleExploreClick = () => {
    setMenuOpen(true);
  };

  // Handler to close the prospecting menu
  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

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

  // Update the header title when expandedMilestoneId changes
  useEffect(() => {
    if (!onTimelineTitleChange) return;
    
    if (expandedMilestoneId) {
      // Find which branch the expanded milestone belongs to
      const branchId = milestones.find(m => m.id === expandedMilestoneId)?.branchId;
      
      if (branchId) {
        const branch = branches.find(b => b.id === branchId);
        
        if (branch) {
          if (branch.isMainTimeline) {
            onTimelineTitleChange('historical');
          } else if (branch.name.toLowerCase().includes('optimistic')) {
            onTimelineTitleChange('optimistic');
          } else if (branch.name.toLowerCase().includes('pessimistic')) {
            onTimelineTitleChange('pessimistic');
          } else {
            onTimelineTitleChange('future');
          }
        }
      }
    }
  }, [expandedMilestoneId, milestones, branches, onTimelineTitleChange]);

  // Return the appropriate branch component(s) based on whether branches are shown
  const renderBranches = () => {
    if (mainBranch) {
      return (
        <div className="timeline-layout">
          {/* Main timeline (historical section) */}
          <div className="historical-timeline-section">
            <TimelineBranch
              branch={mainBranch}
              milestones={milestonesBeforeBranchPoint}
              expandedMilestoneId={expandedMilestoneId}
              onToggleExpand={toggleMilestoneExpansion}
              hideTitle={true}
            />
            
            {/* Branch point - transition to future */}
            <div className="timeline-branch-point timeline-present-marker" data-testid="branch-point">
              <div className="branch-point-connector"></div>
              
              <button 
                className="show-future-branches-button timeline-present-marker" 
                onClick={() => updateFilter({ ...filter, showBranches: !filter.showBranches })}
              >
                {filter.showBranches ? "Hide Future" : "Show Future Branches"}
              </button>
              
              {/* Only show branch date if we're not showing branches */}
              {!filter.showBranches && (
                <div className="timeline-branch-date">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              )}
            </div>
            
            {/* Future branches section - only shown if showBranches is true */}
            {filter.showBranches && (
              <div className="future-timelines-section">
                {/* Container for future branches */}
                <div className={`future-paths-container ${
                  (hasExpandedOptimistic && hasExpandedPessimistic) ? 'both-expanded' :
                  (hasExpandedOptimistic || hasExpandedPessimistic) ? 'one-expanded' : ''
                }`}>
                  {/* Optimistic branch */}
                  {optimisticBranch && (
                    <div className={`future-branch optimistic-branch ${hasExpandedOptimistic ? 'has-expanded' : ''}`}>
                      <TimelineBranch
                        branch={optimisticBranch}
                        milestones={milestonesByBranch[optimisticBranch.id] || []}
                        expandedMilestoneId={expandedMilestoneId}
                        onToggleExpand={toggleMilestoneExpansion}
                        hideTitle={true}
                      />
                    </div>
                  )}
                  
                  {/* Pessimistic branch */}
                  {pessimisticBranch && (
                    <div className={`future-branch pessimistic-branch ${hasExpandedPessimistic ? 'has-expanded' : ''}`}>
                      <TimelineBranch
                        branch={pessimisticBranch}
                        milestones={milestonesByBranch[pessimisticBranch.id] || []}
                        expandedMilestoneId={expandedMilestoneId}
                        onToggleExpand={toggleMilestoneExpansion}
                        hideTitle={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div 
      className="timeline-container" 
      ref={timelineContainerRef}
      data-show-options={showOptionsBox}
    >
      {/* Options box is now handled by the App component */}
      
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
        {renderBranches()}
        
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
          <div className="year-indicator-content">
            <svg className="ship-icon" width="72" height="38" viewBox="0 0 72 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Main hull - shaped for rightward motion with pointed bow */}
              <path d="M12 26H50C50 26 58 26 60 22C62 18 57 31 50 31H20C14 31 12 28 12 26Z" fill="#0A93FF" fillOpacity="0.95" />
              
              {/* Two asymmetrical sails */}
              <path d="M30 6L20 22H40L30 6Z" fill="#0A93FF" fillOpacity="0.95" />
              <path d="M42 10L36 22H48L42 10Z" fill="#0A93FF" fillOpacity="0.95" />
              
              {/* Portholes/windows in hull */}
              <circle cx="22" cy="28" r="1.5" fill="#0A93FF" fillOpacity="1" />
              <circle cx="32" cy="28" r="1.5" fill="#0A93FF" fillOpacity="1" />
              <circle cx="42" cy="28" r="1.5" fill="#0A93FF" fillOpacity="1" />
              
              {/* Deck details with asymmetry */}
              <line x1="15" y1="26" x2="55" y2="26" stroke="#0A93FF" strokeWidth="1.2" strokeDasharray="2 1" />
              
              {/* Stars around the ship */}
              <circle cx="10" cy="12" r="1" fill="white" fillOpacity="0.8" className="twinkle-star" />
              <circle cx="62" cy="10" r="1" fill="white" fillOpacity="0.8" className="twinkle-star" />
              <circle cx="6" cy="20" r="0.8" fill="white" fillOpacity="0.7" className="twinkle-star" />
              <circle cx="58" cy="20" r="0.8" fill="white" fillOpacity="0.7" className="twinkle-star" />
              <circle cx="18" cy="8" r="0.7" fill="white" fillOpacity="0.6" className="twinkle-star" />
              <circle cx="50" cy="8" r="0.7" fill="white" fillOpacity="0.6" className="twinkle-star" />
            </svg>
          </div>
        )}
        {scrollThresholdProgress > 0 && (
          <div className="closing-progress-indicator" />
        )}
      </div>

      {/* Telescope explore button - visible when user has scrolled to the end and future branches are shown */}
      <TimelineExploreButton
        visible={hasReachedEnd && filter.showBranches}
        onClick={handleExploreClick}
      />

      {/* Prospecting Menu */}
      <ProspectingMenu isOpen={menuOpen} onClose={handleCloseMenu} />
    </div>
  );
};

export default Timeline; 