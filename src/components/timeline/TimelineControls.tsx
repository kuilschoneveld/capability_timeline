import React from 'react';
import { TimelineBranch, TimelineFilter, TimelineViewMode } from '../../types';

interface TimelineControlsProps {
  branches: TimelineBranch[];
  selectedBranch: string;
  viewMode: TimelineViewMode;
  filter: TimelineFilter;
  onChangeBranch: (branchId: string) => void;
  onChangeViewMode: (mode: TimelineViewMode) => void;
  onUpdateFilter: (filter: Partial<TimelineFilter>) => void;
  onToggleBranchVisibility: () => void;
}

/**
 * Component for timeline controls (filtering, navigation, etc.)
 */
const TimelineControls: React.FC<TimelineControlsProps> = ({
  branches,
  selectedBranch,
  viewMode,
  filter,
  onChangeBranch,
  onChangeViewMode,
  onUpdateFilter,
  onToggleBranchVisibility,
}) => {
  // Handle branch selection
  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeBranch(e.target.value);
  };

  // Handle view mode change
  const handleViewModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeViewMode(e.target.value as TimelineViewMode);
  };

  // Handle thematic dimension toggle
  const handleDimensionToggle = (dimension: string) => {
    const newDimensions = {
      ...filter.thematicDimensions,
      [dimension]: !filter.thematicDimensions[dimension],
    };
    
    onUpdateFilter({
      thematicDimensions: newDimensions,
    });
  };

  // Handle threshold change
  const handleThresholdChange = (dimension: string, value: number) => {
    const newThresholds = {
      ...filter.minThresholds,
      [dimension]: value,
    };
    
    onUpdateFilter({
      minThresholds: newThresholds,
    });
  };

  return (
    <div className="timeline-controls">
      <div className="timeline-controls-section">
        <h3>Timeline Navigation</h3>
        
        {/* Branch selection */}
        <div className="control-group">
          <label htmlFor="branch-select">Timeline Branch:</label>
          <select 
            id="branch-select" 
            value={selectedBranch}
            onChange={handleBranchChange}
          >
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* View mode selection */}
        <div className="control-group">
          <label htmlFor="view-mode-select">View Mode:</label>
          <select 
            id="view-mode-select" 
            value={viewMode}
            onChange={handleViewModeChange}
          >
            <option value={TimelineViewMode.SCROLL}>Scroll</option>
            <option value={TimelineViewMode.DRAG}>Drag</option>
            <option value={TimelineViewMode.ZOOM}>Zoom</option>
          </select>
        </div>
        
        {/* Branch visibility toggle */}
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={filter.showBranches}
              onChange={onToggleBranchVisibility}
            />
            Show Future Branches
          </label>
        </div>
      </div>
      
      <div className="timeline-controls-section">
        <h3>Thematic Filters</h3>
        
        {/* Thematic dimension toggles */}
        <div className="thematic-filters">
          {Object.entries(filter.thematicDimensions).map(([dimension, isActive]) => (
            <div key={dimension} className="thematic-filter-group">
              <div className="dimension-toggle">
                <label>
                  <input 
                    type="checkbox" 
                    checked={isActive}
                    onChange={() => handleDimensionToggle(dimension)}
                  />
                  {dimension.charAt(0).toUpperCase() + dimension.slice(1)}
                </label>
              </div>
              
              {isActive && (
                <div className="threshold-slider">
                  <label htmlFor={`${dimension}-threshold`}>
                    Min: {filter.minThresholds[dimension]}
                  </label>
                  <input 
                    id={`${dimension}-threshold`}
                    type="range" 
                    min="0" 
                    max="10" 
                    value={filter.minThresholds[dimension]}
                    onChange={(e) => handleThresholdChange(dimension, parseInt(e.target.value))}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineControls; 