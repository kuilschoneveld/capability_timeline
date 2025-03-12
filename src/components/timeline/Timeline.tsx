// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useRef } from 'react';
import { useTimeline } from '../../hooks/useTimeline';
import TimelineBranch from './TimelineBranch';
import TimelineControls from './TimelineControls';

/**
 * Main Timeline component that displays the entire timeline
 */
const Timeline: React.FC = () => {
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

  // Get main timeline branch and its milestones
  const mainBranch = branches.find(branch => branch.isMainTimeline);
  const futureBranches = branches.filter(branch => !branch.isMainTimeline);
  
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

  return (
    <div className="timeline-container">
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
      
      <div className="vertical-metric-axis">
        <span>PFlops / some loose metric</span>
      </div>
      
      <div className="timeline-content">
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