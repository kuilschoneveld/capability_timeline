import { TimelineEvent, TimelineBranch, TimelineFilter } from '../types';
import timelineEvents from '../data/timelineDatabase';

// Create TimelineBranches from timelineEvents
const extractBranches = (): TimelineBranch[] => {
  // Get unique branch IDs
  const branchIds = Array.from(new Set(timelineEvents.map(event => event.branchId)));
  
  console.log("Unique branch IDs:", branchIds);
  
  // Create branches
  return branchIds.map(id => {
    // Determine if this is the main timeline branch
    const isMainTimeline = id === 'main';
    
    // Create a proper name for the branch
    const name = id === 'main' ? 'Historical Timeline' : 
          id === 'future-optimistic' ? 'Optimistic Future' : 
          id === 'future-pessimistic' ? 'Pessimistic Future' : 
          'Timeline Branch';
    
    // Create a proper description for the branch
    const description = id === 'main' ? 'The historical progression of algorithmic capability' :
                id === 'future-optimistic' ? 'A future where algorithmic advances lead to broadly positive outcomes' :
                id === 'future-pessimistic' ? 'A future where algorithmic advances lead to concerning outcomes' :
                'A branch of the timeline';
    
    const branch = {
      id,
      name,
      description,
      isMainTimeline,
      // Additional fields for future branches
      ...(isMainTimeline ? {} : {
        startDate: '2025-01-01', // Default start date for future branches
        parentBranchId: 'main'
      })
    };
    
    console.log(`Created branch for ${id}:`, branch);
    return branch;
  });
};

// All events are directly used without conversion
const allEvents = timelineEvents;

// Log initial data
const allBranches = extractBranches();
console.log(`Initialized TimelineService with ${allBranches.length} branches and ${allEvents.length} events`);
console.log("All branches:", allBranches.map(b => b.id));
console.log("Event count by branch:", 
  allBranches.map(branch => ({
    branch: branch.id,
    count: allEvents.filter(m => m.branchId === branch.id).length
  }))
);

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
   * Get all events
   * @returns Promise resolving to all events
   */
  getAllMilestones: async (): Promise<TimelineEvent[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return allEvents;
  },

  /**
   * Get events for a specific branch
   * @param branchId The ID of the branch to get events for
   * @returns Promise resolving to events for the specified branch
   */
  getMilestonesByBranch: async (branchId: string): Promise<TimelineEvent[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return allEvents.filter(event => event.branchId === branchId);
  },

  /**
   * Get a specific event by ID
   * @param eventId The ID of the event to retrieve
   * @returns Promise resolving to the requested event or undefined if not found
   */
  getMilestoneById: async (eventId: string): Promise<TimelineEvent | undefined> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return allEvents.find(event => event.id === eventId);
  },

  /**
   * Filter events based on provided criteria
   * @param filter The filter criteria to apply
   * @returns Promise resolving to filtered events
   */
  filterMilestones: async (filter: TimelineFilter): Promise<TimelineEvent[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    console.log("Filtering events with filter:", filter);
    console.log("All events before filtering:", allEvents);
    
    // Start with all events
    let filteredEvents = [...allEvents];
    
    // Filter by branch visibility
    if (!filter.showBranches) {
      // Only show main timeline if branches are hidden
      filteredEvents = filteredEvents.filter(
        event => event.branchId === 'main'
      );
    } else {
      // When showing branches, get both main and future branches
      const futureBranchIds = allBranches
        .filter(branch => !branch.isMainTimeline)
        .map(branch => branch.id);
      
      console.log("Future branch IDs:", futureBranchIds);
    }
    
    console.log("Events after branch visibility filtering:", filteredEvents.length);
    
    // Filter by thematic dimensions
    if (filter.thematicDimensions) {
      // For each active dimension, check if the event meets the threshold
      Object.entries(filter.thematicDimensions).forEach(([dimension, isActive]) => {
        if (isActive && filter.minThresholds[dimension] !== undefined) {
          const threshold = filter.minThresholds[dimension];
          filteredEvents = filteredEvents.filter(
            event => 
              event.impact[dimension] !== undefined && 
              event.impact[dimension] >= threshold
          );
        }
      });
    }
    
    console.log("Events after thematic filtering:", filteredEvents.length);
    
    // Filter by date range if provided
    if (filter.dateRange) {
      const { start, end } = filter.dateRange;
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.date);
        return (
          (!start || eventDate >= new Date(start)) && 
          (!end || eventDate <= new Date(end))
        );
      });
    }
    
    console.log("Final filtered events:", filteredEvents);
    
    return filteredEvents;
  }
}; 