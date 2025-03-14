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
        
        // Load main timeline milestones
        console.log("Loading main branch milestones");
        const mainMilestones = await TimelineService.getMilestonesByBranch('main');
        console.log("Loaded main milestones:", mainMilestones);
        setMilestones(mainMilestones);
        
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
      
      // Apply filters
      const filteredMilestones = await TimelineService.filterMilestones(updatedFilter);
      setMilestones(filteredMilestones);
      setError(null);
    } catch (err) {
      setError('Failed to apply filters');
      console.error('Error applying filters:', err);
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
    const showBranches = !filter.showBranches;
    
    try {
      setLoading(true);
      
      // Log what we're doing
      console.log(`Toggling branch visibility. showBranches: ${showBranches}`);
      
      if (showBranches) {
        // When showing branches, load all milestones
        console.log("Loading all milestones including future branches");
        const allMilestones = await TimelineService.getAllMilestones();
        console.log(`Loaded ${allMilestones.length} total milestones across all branches`);
        
        // Count per branch for debugging
        const branchCounts = branches.map(branch => ({
          branch: branch.id,
          count: allMilestones.filter(m => m.branchId === branch.id).length
        }));
        console.log("Milestone counts by branch:", branchCounts);
        
        setMilestones(allMilestones);
      } else {
        // When hiding branches, only show main timeline
        console.log("Loading only main branch milestones");
        const mainMilestones = await TimelineService.getMilestonesByBranch('main');
        console.log(`Loaded ${mainMilestones.length} milestones from main branch`);
        setMilestones(mainMilestones);
      }
      
      // Update filter
      setFilter(prevFilter => ({
        ...prevFilter,
        showBranches
      }));
      
      setError(null);
    } catch (err) {
      setError('Failed to toggle branch visibility');
      console.error('Error toggling branch visibility:', err);
    } finally {
      setLoading(false);
    }
  }, [filter.showBranches, branches]);

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