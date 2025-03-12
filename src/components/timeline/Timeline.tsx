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
      return;
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
  }, [expandedMilestoneId, milestonesByBranch, optimisticBranch, pessimisticBranch]);

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
    <div className="timeline-container">
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
    </div>
  );
};

export default Timeline; 