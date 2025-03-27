/**
 * Timeline data types for the capability timeline application
 */

/**
 * Represents a single event in the timeline
 */
export interface TimelineEvent {
  // Basic identifiers
  id: string;
  title: string;
  date: string; // ISO format date
  description: string;
  
  // Visual properties and relationships
  branchId: string;
  position?: { x: number; y: number }; // For networked view
  parentMilestoneId?: string; // For connecting branches to main timeline
  
  // URLs and resources
  urls: {
    primary?: string;
    documentation?: string;
    relatedResources: string[];
  };
  imageUrl?: string; // Convenience alias for urls.primary
  sourceUrls?: string[]; // Convenience alias for urls.relatedResources
  
  // Connections to other events
  connections: {
    preceding: string[]; // IDs of events that led to this
    following: string[]; // IDs of events that followed from this
    parallel: string[]; // IDs of concurrent/related events
  };
  
  // Technical characteristics
  technicalNature: {
    medium: string; // e.g., "Digital hardware", "Software", "Theoretical model"
    abstractionLevel: string; // Descriptive list from most abstract to most concrete
    centralMechanism: string; // 100-word summary
    complexityScore: number; // 1-10 scale
    innovationScore: number; // 1-10 scale
  };
  
  // Cognitive dimensions
  cognitiveDimensions: {
    computation: number; // 1-10 scale
    pattern_recognition: number;
    reasoning: number;
    self_awareness: number;
    creativity: number;
    notable_innovation: string; // Description of why it advanced the state of the art
  };
  
  // Impact dimensions (used directly as thematicTags in the old model)
  impact: {
    technical: number; // 1-10 scale
    societal: number; // 1-10 scale
    philosophical: number; // 1-10 scale
    economic: number; // 1-10 scale
    geopolitical: number; // 1-10 scale
    [key: string]: number; // Allow for future impact dimensions
  };
  
  // Additional metadata
  tags: string[];
  contributors: string[];
  era: string; // e.g., "Pre-computing", "Early computing", "AI winter", "Modern ML"
}

// Alias for backward compatibility
export type Milestone = TimelineEvent;

/**
 * Thematic dimensions for filtering events
 * Each dimension is rated on a scale of 0-10
 * This interface is kept for backward compatibility
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