import React from 'react';
import { TimelineBranch, TimelineFilter, TimelineViewMode } from '../../types';
import timelineEvents from '../../data/timelineDatabase';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  branches,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedBranch,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  viewMode,
  filter,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChangeBranch,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChangeViewMode,
  onUpdateFilter,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onToggleBranchVisibility,
}) => {
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
      <div className="timeline-controls-section filters-section">
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