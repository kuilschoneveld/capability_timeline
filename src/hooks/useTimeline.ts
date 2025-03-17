import { useState, useEffect, useCallback } from 'react';
import { Milestone, TimelineBranch, TimelineFilter, TimelineViewMode } from '../types';
import { TimelineService } from '../services/timelineService';

/**
 * Default filter settings
 */
const defaultFilter: TimelineFilter = {
  thematicDimensions: {
    technical: true,
    societal: true,
    philosophical: true,
  },
  minThresholds: {
    technical: 0,
    societal: 0,
    philosophical: 0,
  },
  showBranches: false, // Initially only show main timeline
  dateRange: undefined // No date range filtering by default
};

/**
 * Custom hook for managing timeline data and state
 */
export const useTimeline = () => {
  // State for milestones and branches
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [branches, setBranches] = useState<TimelineBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  
  // State for loading and error handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and view mode
  const [filter, setFilter] = useState<TimelineFilter>(defaultFilter);
  const [viewMode, setViewMode] = useState<TimelineViewMode>(TimelineViewMode.DRAG);
  
  // State for expanded milestone details
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(null);

  /**
   * Load initial timeline data
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load all branches
        const branchesData = await TimelineService.getBranches();
        console.log("Loaded branches:", branchesData);
        setBranches(branchesData);
        
        // Load ALL milestones
        console.log("Loading all milestones");
        const allMilestones = await TimelineService.getAllMilestones();
        
        // Filter to main branch only for initial load
        const mainBranchMilestones = allMilestones.filter(m => m.branchId === 'main');
        console.log(`Loaded ${allMilestones.length} total milestones, ${mainBranchMilestones.length} in main branch`);
        
        setMilestones(mainBranchMilestones);
        
        setError(null);
      } catch (err) {
        setError('Failed to load timeline data');
        console.error('Error loading timeline data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  /**
   * Change the selected branch
   */
  const changeBranch = useCallback(async (branchId: string) => {
    try {
      setLoading(true);
      const branchMilestones = await TimelineService.getMilestonesByBranch(branchId);
      setMilestones(branchMilestones);
      setSelectedBranch(branchId);
      setError(null);
    } catch (err) {
      setError(`Failed to load milestones for branch: ${branchId}`);
      console.error(`Error loading milestones for branch ${branchId}:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update filter settings and apply filters
   */
  const updateFilter = useCallback(async (newFilter: Partial<TimelineFilter>) => {
    try {
      setLoading(true);
      
      // Merge with existing filter
      const updatedFilter = { ...filter, ...newFilter };
      setFilter(updatedFilter);
      
      console.log("Applying filter:", updatedFilter);
      
      // Load all milestones first
      const allMilestones = await TimelineService.getAllMilestones();
      console.log(`Total milestones loaded: ${allMilestones.length}`);
      
      // Apply branch filtering
      let filteredMilestones = allMilestones;
      if (!updatedFilter.showBranches) {
        // Only show main timeline if branches are hidden
        filteredMilestones = allMilestones.filter(m => m.branchId === 'main');
        console.log(`Filtered to ${filteredMilestones.length} main branch milestones`);
      }
      
      // Apply thematic dimension filtering if thresholds are set above zero
      if (updatedFilter.thematicDimensions) {
        let beforeCount = filteredMilestones.length;
        
        // For each active dimension, check if the milestone meets the threshold
        Object.entries(updatedFilter.thematicDimensions).forEach(([dimension, isActive]) => {
          if (isActive && updatedFilter.minThresholds[dimension] > 0) {
            const threshold = updatedFilter.minThresholds[dimension];
            filteredMilestones = filteredMilestones.filter(
              milestone => 
                (milestone.thematicTags[dimension] !== undefined && 
                milestone.thematicTags[dimension] >= threshold)
            );
          }
        });
        
        console.log(`Thematic filtering: ${beforeCount} → ${filteredMilestones.length} milestones`);
      }
      
      // Apply date range filtering if specified
      if (updatedFilter.dateRange && (updatedFilter.dateRange.start || updatedFilter.dateRange.end)) {
        let beforeCount = filteredMilestones.length;
        const { start, end } = updatedFilter.dateRange;
        
        filteredMilestones = filteredMilestones.filter(milestone => {
          const milestoneDate = new Date(milestone.date);
          return (
            (!start || milestoneDate >= new Date(start)) && 
            (!end || milestoneDate <= new Date(end))
          );
        });
        
        console.log(`Date range filtering: ${beforeCount} → ${filteredMilestones.length} milestones`);
      }
      
      console.log(`Final filtered milestones: ${filteredMilestones.length} of ${allMilestones.length} total`);
      setMilestones(filteredMilestones);
      setError(null);
    } catch (err) {
      setError('Failed to update filter');
      console.error('Error updating filter:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  /**
   * Toggle milestone expansion
   */
  const toggleMilestoneExpansion = useCallback((milestoneId: string) => {
    setExpandedMilestoneId(prevId => prevId === milestoneId ? null : milestoneId);
  }, []);

  /**
   * Change view mode
   */
  const changeViewMode = useCallback((mode: TimelineViewMode) => {
    setViewMode(mode);
  }, []);

  /**
   * Toggle branch visibility
   */
  const toggleBranchVisibility = useCallback(async () => {
    try {
      setLoading(true);
      
      // Toggle the showBranches setting
      const showBranches = !filter.showBranches;
      setFilter(prev => ({ ...prev, showBranches }));
      
      console.log(`Toggling branch visibility: ${showBranches ? 'showing all branches' : 'showing only main branch'}`);
      
      // Load all milestones first
      const allMilestones = await TimelineService.getAllMilestones();
      console.log(`Total milestones loaded: ${allMilestones.length}`);
      
      // Apply branch filtering based on the new setting
      let filteredMilestones;
      if (!showBranches) {
        // Only show main timeline if branches are hidden
        filteredMilestones = allMilestones.filter(m => m.branchId === 'main');
        console.log(`Filtered to ${filteredMilestones.length} main branch milestones`);
      } else {
        // Show all milestones when branches are visible
        filteredMilestones = allMilestones;
        console.log(`Showing all ${filteredMilestones.length} milestones from all branches`);
      }
      
      setMilestones(filteredMilestones);
      setError(null);
    } catch (err) {
      setError('Failed to toggle branch visibility');
      console.error('Error toggling branch visibility:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  return {
    // Data
    milestones,
    branches,
    selectedBranch,
    expandedMilestoneId,
    
    // State
    loading,
    error,
    filter,
    viewMode,
    
    // Actions
    changeBranch,
    updateFilter,
    toggleMilestoneExpansion,
    changeViewMode,
    toggleBranchVisibility,
  };
}; 