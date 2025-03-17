/**
 * Types for the networked timeline visualization
 * These types support non-linear, multi-connected timeline events
 */

/**
 * Position interface represents a point in 2D space
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Represents a single node/event in the networked timeline
 */
export interface TimelineNode {
  id: string;
  title: string;
  date: string; // ISO date string
  description: string;
  
  // Spatial positioning
  position: Position; // Changed from separate x,y to Position object
  
  // Connections are now handled in separate TimelineConnection objects
  
  // Optional properties
  imageUrl?: string;
  sourceUrls?: string[];
  
  // Thematic dimensions - preserve existing functionality
  thematicTags: Record<string, number>; // Tag name -> value (0-10)
  
  // Branch information - preserve existing functionality
  branchId: string;
  
  // Visual customization
  color?: string; // Optional color override
  size?: number; // Optional size override
}

/**
 * Represents a connection between two nodes in the timeline
 */
export interface TimelineConnection {
  id: string; // Usually formatted as "sourceId-targetId"
  sourceId: string;
  targetId: string;
  
  // Optional visual properties
  color?: string;
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  isHighlighted?: boolean;
  
  // Optional semantic properties
  label?: string;
  type?: string; // e.g., "influences", "enables", "contradicts"
  strength?: number; // 0-1 representing connection strength
}

/**
 * Represents a timeline branch in a networked context
 */
export interface TimelineBranch {
  id: string;
  name: string;
  description: string;
  color: string;
  
  // Node IDs that belong to this branch
  nodeIds: string[];
  
  // Preserve existing functionality
  parentBranchId?: string;
}

/**
 * Thematic dimensions for filtering milestones
 * Each dimension is rated on a scale of 0-10
 */
export interface ThematicTags {
  technical: number; // Technical significance (0-10)
  societal: number; // Societal impact (0-10)
  philosophical: number; // Philosophical implications (0-10)
  [key: string]: number; // Allow for future thematic dimensions
}

/**
 * Configuration for the network visualization
 */
export interface NetworkConfig {
  // Display settings
  nodeSize: number;
  nodeBorderWidth: number;
  connectionLineWidth: number;
  connectionLineOpacity: number;
  
  // Physics settings
  springLength: number; // Natural length of connections
  springStrength: number; // Connection strength
  repulsionStrength: number; // How strongly nodes repel each other
  
  // Navigation settings
  zoomRange: [number, number]; // Min and max zoom levels
  initialZoom: number;
  
  // Visual settings
  defaultNodeColor: string;
  defaultLineColor: string;
  
  // Interactive behavior
  highlightConnections: boolean; // Whether to highlight connections on hover
}

/**
 * State of the networked timeline visualization
 */
export interface NetworkedTimelineState {
  // Collections
  nodes: TimelineNode[];
  connections: TimelineConnection[];
  branches: Record<string, TimelineBranch>;
  
  // Current selection
  selectedNode: TimelineNode | null;
  
  // Current view state
  viewState: {
    position: Position;
    zoom: number;
    highlightedNodeIds: string[];
    highlightedConnectionIds: string[];
  };
}

/**
 * Connection between two nodes
 */
export interface NodeConnection {
  id: string; // Usually formatted as "sourceId-targetId"
  sourceId: string;
  targetId: string;
  
  // Optional visual properties
  color?: string;
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  
  // Optional semantic properties
  label?: string;
  type?: string; // e.g., "influences", "enables", "contradicts"
  strength?: number; // 0-1 representing connection strength
} 