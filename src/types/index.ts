/**
 * Timeline data types for the capability timeline application
 */

/**
 * Represents a single milestone in the timeline
 */
export interface Milestone {
  id: string;
  title: string;
  date: string; // ISO date string
  description: string;
  imageUrl?: string;
  sourceUrls?: string[];
  thematicTags: ThematicTags;
  branchId?: string; // For future branching timelines
  parentMilestoneId?: string; // For connecting branches to main timeline
  notable_innovation?: string; // Description of why it advanced the state of the art
}

/**
 * Thematic dimensions for filtering milestones
 * Each dimension is rated on a scale of 0-10
 */
export interface ThematicTags {
  technical: number; // Technical significance (0-10)
  societal: number; // Societal impact (0-10)
  philosophical: number; // Philosophical implications (0-10)
  economic: number; // Economic impact (0-10)
  geopolitical: number; // Geopolitical implications (0-10)
  [key: string]: number; // Allow for future thematic dimensions
}

/**
 * Represents a timeline branch (main timeline or alternative future)
 */
export interface TimelineBranch {
  id: string;
  name: string;
  description: string;
  isMainTimeline: boolean;
  startDate?: string; // When this branch begins (for future branches)
  parentBranchId?: string; // For nested branches
}

/**
 * Timeline view mode for different navigation methods
 */
export enum TimelineViewMode {
  DRAG = 'drag'
}

/**
 * Filter settings for the timeline
 */
export interface TimelineFilter {
  thematicDimensions: {
    [key: string]: boolean; // Which dimensions are active
  };
  minThresholds: {
    [key: string]: number; // Minimum threshold for each dimension (0-10)
  };
  showBranches: boolean; // Whether to show branching timelines
  dateRange?: {
    start: string;
    end: string;
  };
} 