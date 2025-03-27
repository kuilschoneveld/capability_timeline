// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useRef, useState, useEffect } from 'react';
import { useTimeline } from '../../hooks/useTimeline';
import TimelineBranch from './TimelineBranch';
import TimelineControls from './TimelineControls';
import TimelineExploreButton from './TimelineExploreButton';
import ProspectingMenu from '../ProspectingMenu';
import timelineEvents from '../../data/timelineDatabase';
import { Milestone } from '../../types';

interface TimelineProps {
  showOptionsBox?: boolean;
  onTimelineTitleChange?: (title: 'historical' | 'optimistic' | 'pessimistic' | 'future') => void;
  filterEvents: (events: Milestone[]) => Milestone[];
  onMilestoneExpansion?: (milestoneId: string | null) => void;
}

/**
 * Main Timeline component that displays the entire timeline
 */
const Timeline: React.FC<TimelineProps> = ({ showOptionsBox = true, onTimelineTitleChange, filterEvents, onMilestoneExpansion }) => {
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
  
  // Filter the milestones based on the active filters
  const filteredMilestones = filterEvents(milestones);
  
  // Track the expanded state for each branch separately for better positioning
  const [hasExpandedOptimistic, setHasExpandedOptimistic] = useState(false);
  const [hasExpandedPessimistic, setHasExpandedPessimistic] = useState(false);
  
  // Track the currently displayed year for the year indicator
  const [displayedYear, setDisplayedYear] = useState<string | null>(null);
  
  // Reference to the timeline container for visibility checking
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Track if user has reached the end of the timeline
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  // Group milestones by branch
  const milestonesByBranch = branches.reduce((acc, branch) => {
    acc[branch.id] = filteredMilestones.filter(m => m.branchId === branch.id);
    return acc;
  }, {} as Record<string, typeof milestones>);

  // Get main timeline branch and its milestones
  const mainBranch = branches.find(branch => branch.isMainTimeline);
  
  // Get future branches and separate them into optimistic and pessimistic
  const futureBranches = branches.filter(branch => !branch.isMainTimeline);
  
  // For demo purposes, we'll consider the first future branch as optimistic and the second as pessimistic
  // In a real app, this would be determined by branch metadata
  const optimisticBranch = futureBranches.find(branch => branch.id === 'future-optimistic');
  const pessimisticBranch = futureBranches.find(branch => branch.id === 'future-pessimistic');
  
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
  
  // Update expanded state for branches and handle year display when expandedMilestoneId changes
  useEffect(() => {
    if (!expandedMilestoneId) {
      setHasExpandedOptimistic(false);
      setHasExpandedPessimistic(false);
      setDisplayedYear(null);
      return;
    }
    
    // Find the expanded milestone to get its year
    const expandedMilestone = milestones.find(m => m.id === expandedMilestoneId);
    if (expandedMilestone) {
      const date = new Date(expandedMilestone.date);
      setDisplayedYear(date.getFullYear().toString());
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

  // Check if the expanded milestone is visible in the viewport and update year indicator accordingly
  useEffect(() => {
    if (!expandedMilestoneId) return;

    const checkVisibility = () => {
      const expandedElement = document.querySelector(`[data-milestone-id="${expandedMilestoneId}"][data-expanded="true"]`);
      if (!expandedElement) return;

      const parentContainer = document.querySelector('.App-main');
      if (!parentContainer) return;

      const rect = expandedElement.getBoundingClientRect();
      const containerRect = parentContainer.getBoundingClientRect();
      
      // Check if the expanded milestone is visible in the viewport
      const isVisible = !(
        rect.right < containerRect.left ||
        rect.left > containerRect.right
      );
      
      // If not visible, close the expanded milestone and clear the year
      if (!isVisible) {
        setDisplayedYear(null);
        toggleMilestoneExpansion(expandedMilestoneId);
      }
    };
    
    // Listen for scroll events on the parent container
    const parentContainer = document.querySelector('.App-main');
    if (parentContainer) {
      parentContainer.addEventListener('scroll', checkVisibility, { passive: true });
      
      // Initial check
      checkVisibility();
    }
    
    return () => {
      if (parentContainer) {
        parentContainer.removeEventListener('scroll', checkVisibility);
      }
    };
  }, [expandedMilestoneId, toggleMilestoneExpansion]);

  // Update the timeline title based on scroll position
  useEffect(() => {
    if (!onTimelineTitleChange) return;
    
    const handleScrollForTitle = () => {
      const parentContainer = document.querySelector('.App-main');
      if (!parentContainer) return;
      
      // Find the branch point element (the present marker)
      const branchPointElement = parentContainer.querySelector('.timeline-present-marker');
      if (!branchPointElement) return;
      
      // Calculate midpoint of window
      const windowMidpoint = window.innerWidth / 2;
      const branchPointRect = branchPointElement.getBoundingClientRect();
      const branchPointCenter = branchPointRect.left + (branchPointRect.width / 2);
      
      // If branch point has passed the middle of the screen, we're in the "future" view
      const isFutureView = branchPointCenter < windowMidpoint;
      
      // Update the title based on whether we're looking at history or future
      if (isFutureView) {
        if (expandedMilestoneId) {
          // Find which branch the expanded milestone belongs to
          const milestone = milestones.find(m => m.id === expandedMilestoneId);
          if (milestone && milestone.branchId === 'future-optimistic') {
            onTimelineTitleChange('optimistic');
          } else if (milestone && milestone.branchId === 'future-pessimistic') {
            onTimelineTitleChange('pessimistic');
          } else {
            onTimelineTitleChange('future');
          }
        } else {
          onTimelineTitleChange('future');
        }
      } else {
        onTimelineTitleChange('historical');
      }
    };
    
    const parentContainer = document.querySelector('.App-main');
    if (parentContainer) {
      parentContainer.addEventListener('scroll', handleScrollForTitle, { passive: true });
      
      // Initial check
      handleScrollForTitle();
    }
    
    return () => {
      if (parentContainer) {
        parentContainer.removeEventListener('scroll', handleScrollForTitle);
      }
    };
  }, [onTimelineTitleChange, expandedMilestoneId, milestones]);

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

  // Notify parent component when a milestone is expanded
  useEffect(() => {
    if (onMilestoneExpansion) {
      onMilestoneExpansion(expandedMilestoneId);
    }
  }, [expandedMilestoneId, onMilestoneExpansion]);

  // Handler for the explore button click
  const handleExploreClick = () => {
    setMenuOpen(true);
  };

  // Handler to close the prospecting menu
  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  // Get class names for various timeline elements
  const getOptimisticClassName = () => {
    return `future-branch optimistic-branch ${hasExpandedOptimistic ? 'has-expanded' : ''}`;
  };
  
  const getPessimisticClassName = () => {
    return `future-branch pessimistic-branch ${hasExpandedPessimistic ? 'has-expanded' : ''}`;
  };

  const getTimelineContentClassName = () => {
    let className = 'timeline-content';
    
    // Add modifiers based on filter and view mode
    if (filter.showBranches) {
      className += ' show-branches';
    }
    
    // Add view mode as a class
    className += ` view-${viewMode.toLowerCase()}`;
    
    // Add class for expanded events
    if (expandedMilestoneId) {
      className += ' has-expanded-milestone';
    }
    
    return className;
  };

  // Render the branches for the timeline
  const renderBranches = () => {
    const hasBranches = branches.length > 0;
    
    if (!hasBranches) {
      return <div className="timeline-empty-message">No branch data available.</div>;
    }
    
    return (
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
              hideTitle={true}
            />
          )}
          
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
                  <div className={getOptimisticClassName()}>
                    <TimelineBranch
                      key={optimisticBranch.id}
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
                  <div className={getPessimisticClassName()}>
                    <TimelineBranch
                      key={pessimisticBranch.id}
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
        className={`year-indicator ${displayedYear ? 'has-year' : 'no-year'}`}
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
              <circle cx="58" cy="24" r="0.8" fill="white" fillOpacity="0.7" className="twinkle-star" />
            </svg>
          </div>
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