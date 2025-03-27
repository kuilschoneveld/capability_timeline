import { useState, useEffect, useCallback } from 'react';
import { TimelineEvent, TimelineBranch, TimelineFilter, TimelineViewMode } from '../types';
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
  // State for events and branches
  const [milestones, setMilestones] = useState<TimelineEvent[]>([]);
  const [branches, setBranches] = useState<TimelineBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  
  // State for loading and error handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and view mode
  const [filter, setFilter] = useState<TimelineFilter>(defaultFilter);
  const [viewMode, setViewMode] = useState<TimelineViewMode>(TimelineViewMode.DRAG);
  
  // State for expanded event details
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
        
        // Load ALL events
        console.log("Loading all events");
        const allEvents = await TimelineService.getAllMilestones();
        
        // Filter to main branch only for initial load
        const mainBranchEvents = allEvents.filter(e => e.branchId === 'main');
        console.log(`Loaded ${allEvents.length} total events, ${mainBranchEvents.length} in main branch`);
        
        setMilestones(mainBranchEvents);
        
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
      const branchEvents = await TimelineService.getMilestonesByBranch(branchId);
      setMilestones(branchEvents);
      setSelectedBranch(branchId);
      setError(null);
    } catch (err) {
      setError(`Failed to load events for branch: ${branchId}`);
      console.error(`Error loading events for branch ${branchId}:`, err);
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
      
      // Load all events first
      const allEvents = await TimelineService.getAllMilestones();
      console.log(`Total events loaded: ${allEvents.length}`);
      
      // Apply branch filtering
      let filteredEvents = allEvents;
      if (!updatedFilter.showBranches) {
        // Only show main timeline if branches are hidden
        filteredEvents = allEvents.filter(e => e.branchId === 'main');
        console.log(`Filtered to ${filteredEvents.length} main branch events`);
      }
      
      // Apply thematic dimension filtering if thresholds are set above zero
      if (updatedFilter.thematicDimensions) {
        let beforeCount = filteredEvents.length;
        
        // For each active dimension, check if the event meets the threshold
        Object.entries(updatedFilter.thematicDimensions).forEach(([dimension, isActive]) => {
          if (isActive && updatedFilter.minThresholds[dimension] > 0) {
            const threshold = updatedFilter.minThresholds[dimension];
            filteredEvents = filteredEvents.filter(
              event => 
                (event.impact[dimension] !== undefined && 
                event.impact[dimension] >= threshold)
            );
          }
        });
        
        console.log(`Thematic filtering: ${beforeCount} → ${filteredEvents.length} events`);
      }
      
      // Apply date range filtering if specified
      if (updatedFilter.dateRange && (updatedFilter.dateRange.start || updatedFilter.dateRange.end)) {
        let beforeCount = filteredEvents.length;
        const { start, end } = updatedFilter.dateRange;
        
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.date);
          return (
            (!start || eventDate >= new Date(start)) && 
            (!end || eventDate <= new Date(end))
          );
        });
        
        console.log(`Date range filtering: ${beforeCount} → ${filteredEvents.length} events`);
      }
      
      console.log(`Final filtered events: ${filteredEvents.length} of ${allEvents.length} total`);
      setMilestones(filteredEvents);
      setError(null);
    } catch (err) {
      setError('Failed to update filter');
      console.error('Error updating filter:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  /**
   * Toggle event expansion
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
      
      // Load all events first
      const allEvents = await TimelineService.getAllMilestones();
      console.log(`Total events loaded: ${allEvents.length}`);
      
      // Apply branch filtering based on the new setting
      let filteredEvents;
      if (!showBranches) {
        // Only show main timeline if branches are hidden
        filteredEvents = allEvents.filter(e => e.branchId === 'main');
        console.log(`Filtered to ${filteredEvents.length} main branch events`);
      } else {
        // Show all events when branches are visible
        filteredEvents = allEvents;
        console.log(`Showing all ${filteredEvents.length} events from all branches`);
      }
      
      setMilestones(filteredEvents);
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