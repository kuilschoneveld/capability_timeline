import { Milestone, TimelineBranch, TimelineFilter } from '../types';
import { 
  allMilestones, 
  allBranches
} from '../data/mockData';

/**
 * Service to handle timeline data operations
 * This simulates database calls that would be made in a production environment
 */
export const TimelineService = {
  /**
   * Get all timeline branches
   * @returns Promise resolving to all timeline branches
   */
  getBranches: async (): Promise<TimelineBranch[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return allBranches;
  },

  /**
   * Get a specific timeline branch by ID
   * @param branchId The ID of the branch to retrieve
   * @returns Promise resolving to the requested branch or undefined if not found
   */
  getBranchById: async (branchId: string): Promise<TimelineBranch | undefined> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return allBranches.find(branch => branch.id === branchId);
  },

  /**
   * Get all milestones
   * @returns Promise resolving to all milestones
   */
  getAllMilestones: async (): Promise<Milestone[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return allMilestones;
  },

  /**
   * Get milestones for a specific branch
   * @param branchId The ID of the branch to get milestones for
   * @returns Promise resolving to milestones for the specified branch
   */
  getMilestonesByBranch: async (branchId: string): Promise<Milestone[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return allMilestones.filter(milestone => milestone.branchId === branchId);
  },

  /**
   * Get a specific milestone by ID
   * @param milestoneId The ID of the milestone to retrieve
   * @returns Promise resolving to the requested milestone or undefined if not found
   */
  getMilestoneById: async (milestoneId: string): Promise<Milestone | undefined> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return allMilestones.find(milestone => milestone.id === milestoneId);
  },

  /**
   * Filter milestones based on provided criteria
   * @param filter The filter criteria to apply
   * @returns Promise resolving to filtered milestones
   */
  filterMilestones: async (filter: TimelineFilter): Promise<Milestone[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Start with all milestones
    let filteredMilestones = [...allMilestones];
    
    // Filter by branch visibility
    if (!filter.showBranches) {
      // Only show main timeline if branches are hidden
      filteredMilestones = filteredMilestones.filter(
        milestone => milestone.branchId === 'main'
      );
    }
    
    // Filter by thematic dimensions
    if (filter.thematicDimensions) {
      // For each active dimension, check if the milestone meets the threshold
      Object.entries(filter.thematicDimensions).forEach(([dimension, isActive]) => {
        if (isActive && filter.minThresholds[dimension] !== undefined) {
          const threshold = filter.minThresholds[dimension];
          filteredMilestones = filteredMilestones.filter(
            milestone => 
              milestone.thematicTags[dimension] !== undefined && 
              milestone.thematicTags[dimension] >= threshold
          );
        }
      });
    }
    
    // Filter by date range if provided
    if (filter.dateRange) {
      const { start, end } = filter.dateRange;
      filteredMilestones = filteredMilestones.filter(milestone => {
        const milestoneDate = new Date(milestone.date);
        return (
          (!start || milestoneDate >= new Date(start)) && 
          (!end || milestoneDate <= new Date(end))
        );
      });
    }
    
    return filteredMilestones;
  }
}; 