import { Milestone, TimelineBranch, TimelineFilter } from '../types';
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

// Convert TimelineEvent to Milestone
const convertToMilestone = (event: any): Milestone => {
  // Filter out empty URLs
  const relatedResources = event.urls?.relatedResources || [];
  
  // Replace example.com domains with proper domains
  const filteredUrls = relatedResources
    .filter((url: string) => url && url.trim() !== '')
    .map((url: string) => {
      if (url.includes('example.com')) {
        // Transform example URLs to make them look more natural
        return url.replace('example.com', 'ai-timeline.org');
      }
      return url;
    });
  
  // Transform the primary URL if it's an example URL
  let primaryUrl = event.urls?.primary;
  if (primaryUrl && primaryUrl.includes('example.com')) {
    primaryUrl = primaryUrl.replace('example.com', 'ai-timeline.org');
  }
  
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    description: event.description,
    branchId: event.branchId,
    thematicTags: {
      technical: event.impact.technical,
      societal: event.impact.societal,
      philosophical: event.impact.philosophical,
      economic: event.impact.economic,
      geopolitical: event.impact.geopolitical
    },
    // Add the notable_innovation field from the event's cognitive dimensions
    notable_innovation: event.cognitiveDimensions?.notable_innovation || '',
    // Optional fields
    imageUrl: primaryUrl,
    sourceUrls: filteredUrls
  };
};

// Create milestones from timelineEvents
const extractMilestones = (): Milestone[] => {
  console.log(`Extracting all ${timelineEvents.length} milestones from database`);
  return timelineEvents.map(convertToMilestone);
};

// Extract branches and milestones
const allBranches = extractBranches();
const allMilestones = extractMilestones();

// Log initial data
console.log(`Initialized TimelineService with ${allBranches.length} branches and ${allMilestones.length} milestones`);
console.log("All branches:", allBranches.map(b => b.id));
console.log("Milestone count by branch:", 
  allBranches.map(branch => ({
    branch: branch.id,
    count: allMilestones.filter(m => m.branchId === branch.id).length
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
    
    console.log("Filtering milestones with filter:", filter);
    console.log("All milestones before filtering:", allMilestones);
    
    // Start with all milestones
    let filteredMilestones = [...allMilestones];
    
    // Filter by branch visibility
    if (!filter.showBranches) {
      // Only show main timeline if branches are hidden
      filteredMilestones = filteredMilestones.filter(
        milestone => milestone.branchId === 'main'
      );
    } else {
      // When showing branches, get both main and future branches
      const futureBranchIds = allBranches
        .filter(branch => !branch.isMainTimeline)
        .map(branch => branch.id);
      
      console.log("Future branch IDs:", futureBranchIds);
    }
    
    console.log("Milestones after branch visibility filtering:", filteredMilestones.length);
    
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
    
    console.log("Milestones after thematic filtering:", filteredMilestones.length);
    
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
    
    console.log("Final filtered milestones:", filteredMilestones);
    
    return filteredMilestones;
  }
}; 