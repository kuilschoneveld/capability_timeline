/**
 * Represents a single event in the timeline
 */
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  thematicTags: {
    [key: string]: number;
  };
}

/**
 * Represents a connection between two timeline events
 */
export interface TimelineConnection {
  sourceId: string;
  targetId: string;
} 